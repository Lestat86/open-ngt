import { getIqr } from '@/app/utils/misc';
import { mean, median, mode, std } from 'mathjs';

import { ICriteriaMap, ICriteriaMinMax, IItemStat, IItemSummary, IParsedAnswer, IQuestionMap, ITrialAnswerWithCriteriaAndText, ITrialMeasureWithName } from '@/types/misc';
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

export const getTurnHistogram = (answers:ITrialAnswerWithCriteriaAndText[],
                                 criteriaMinMax:ICriteriaMinMax) => {
  const parsedData:IParsedAnswer = {};

  // eslint-disable-next-line consistent-return
  answers.forEach((answer) => {
    if (answer.criteria_id === null || answer.criteria_id === undefined) {
      return null;
    }

    if (!parsedData[answer.trial_item_id]) {
      parsedData[answer.trial_item_id] = {};
    }

    const currentQuestion = parsedData[answer.trial_item_id];

    if (!currentQuestion[answer.criteria_id]) {
      currentQuestion[answer.criteria_id] = {};
    }

    const currentCriteria = currentQuestion[answer.criteria_id];

    if (!currentCriteria[answer.turn]) {
      const criteriaMin = criteriaMinMax[answer.criteria_id].min;
      const criteriaMax = criteriaMinMax[answer.criteria_id].max;
      const values = [];

      for (let i = criteriaMin; i <= criteriaMax; i++) {
        values[i] = 0;
      }

      currentCriteria[answer.turn] = {
        label:           `Turn ${answer.turn}`,
        data:            values,
        // @ts-expect-error fix this later
        borderColor:     TURNS_COLOR[answer.turn],
        // @ts-expect-error fix this later
        backgroundColor: TURNS_COLOR[answer.turn],
      };
    }

    const currentTurn = currentCriteria[answer.turn];

    currentTurn.data[answer.score]++;
  });

  return parsedData;
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

        const stdevOk = targetDevStd ? stdev <= targetDevStd.score : undefined;
        const iqrOk = targetIQR ? iqr <= targetIQR.score : undefined;

        questionSummary[Number(criteriaKey)] = {
          mean:   mean(lastTurn.data),
          median: median(...lastTurn.data),
          mode:   mode(lastTurn.data),
          stdev,
          stdevOk,
          iqr,
          iqrOk,
        };
      });
  });

  return itemSummary;
};

export const areStatsOk = (itemStat:IItemStat) => {
  const stdevWasUsed = itemStat.stdevOk !== undefined;
  const iqrWasUsed = itemStat.iqrOk !== undefined;

  const stdevOk = stdevWasUsed ? itemStat.stdevOk : true;
  const iqrOk = iqrWasUsed ? itemStat.iqrOk : true;

  return stdevOk && iqrOk;
};

export const isItemOk = (itemStats:IItemStat[]) => {
  return itemStats.every((current) => areStatsOk(current));
};

export function twoDecimals(value:number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function isRound(value:number) {
  return (value % 1) === 0;
}
