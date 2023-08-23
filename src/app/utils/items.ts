import { getIqr } from '@/app/utils/misc';
import { mean, std } from 'mathjs';

import { ICriteriaMap, IItemStat, IItemSummary, IParsedAnswer, IQuestionMap, ITrialAnswerWithCriteriaAndText, ITrialMeasureWithName } from '@/types/misc';
import { MEASURES_NAMES, TURNS_COLOR } from '../constants/constants';

export const getParsedAnswers = (answers:ITrialAnswerWithCriteriaAndText[]) => {
  const parsedData:IParsedAnswer = {};
  const questionMap:IQuestionMap = {};
  const criteriaMap:ICriteriaMap = {};

  // eslint-disable-next-line consistent-return
  answers.forEach((answer) => {
    if (answer.criteria_id === null || answer.criteria_id === undefined) {
      return null;
    }

    if (!parsedData[answer.trial_item_id]) {
      parsedData[answer.trial_item_id] = {};
      questionMap[answer.trial_item_id] = answer.trial_item?.item_text;
    }

    const currentQuestion = parsedData[answer.trial_item_id];

    if (!currentQuestion[answer.criteria_id]) {
      currentQuestion[answer.criteria_id] = {};
      criteriaMap[answer.criteria_id] = answer.criteria?.criteria_name;
    }

    const currentCriteria = currentQuestion[answer.criteria_id];

    if (!currentCriteria[answer.turn]) {
      currentCriteria[answer.turn] = {
        label:           `Turn ${answer.turn}`,
        data:            [ answer.score ],
        // @ts-expect-error fix this later
        borderColor:     TURNS_COLOR[answer.turn],
        // @ts-expect-error fix this later
        backgroundColor: TURNS_COLOR[answer.turn],
      };
    } else {
      const currentTurn = currentCriteria[answer.turn];

      currentTurn.data.push(answer.score);
    }
  });

  return { parsedData, questionMap, criteriaMap };
};

export const getStats = (parsedData:IParsedAnswer, measures:ITrialMeasureWithName[]) => {
  const itemSummary:IItemSummary = {};

  Object.keys(parsedData).forEach((questionId) => {
    const currentQuestion = parsedData[Number(questionId)];

    Object
      .keys(currentQuestion).forEach((criteriaKey) => {
        const criteriaTurnValues = currentQuestion[Number(criteriaKey)];

        const turns = Object.values(criteriaTurnValues);
        const lastTurn = turns[turns.length - 1];

        const targetDevStd = measures
          .find((measure) => measure.measures?.measure_name === MEASURES_NAMES.STDEV);
        const targetIQR = measures
          .find((measure) => measure.measures?.measure_name === MEASURES_NAMES.IQR);

        if (!itemSummary[Number(questionId)]) {
          itemSummary[Number(questionId)] = {};
        }

        const stdev = std(...lastTurn.data);
        const iqr = getIqr(lastTurn.data);

        const questionSummary = itemSummary[Number(questionId)];

        questionSummary[Number(criteriaKey)] = {
          mean:    mean(lastTurn.data),
          stdev,
          stdevOk: stdev <= (targetDevStd?.score ?? 0),
          iqr,
          iqrOk:   iqr <= (targetIQR?.score ?? 0),
        };
      });
  });

  return itemSummary;
};

export const isItemOk = (itemStats:IItemStat[]) => {
  return itemStats.every((current) => current.stdevOk && current.iqrOk);
};

export function twoDecimals(value:number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
