import { MathScalarType } from 'mathjs';
import { Criteria, TrialItem, TrialItemWithCriteria, TrialItemsAnswers, TrialMeasures } from './database.types';

export type IGenericColumn = {
    key: string
    name: string
    renderCell?: (props: unknown) => unknown
}

export interface HydratedTrialItemWithCriteria extends TrialItemWithCriteria {
    criteria: Criteria | null
}

export interface HydratedTrialItems extends TrialItem {
    trial_item_with_criteria: HydratedTrialItemWithCriteria[] | null
}

export interface ICartesianPoints {
    x: number
    y: number
}

export interface IChartDataset {
    label: string
    data: number[]
    borderColor: string | string[]
    backgroundColor: string | string[]
}

export interface ITrialAnswerWithCriteriaAndText extends TrialItemsAnswers {
    trial_item: {
        trial_id: string
        item_text: string
    } | null
    criteria: {
        criteria_name: string
    } | null
}

export interface ICriteriaMap {
    [criteriaId: string]: string | undefined
}

export interface IQuestionMap {
    [questionid: string]: string | undefined
}

export interface ICriteriaTurn {
  [criteria:number]: {
    [turn:number]: IChartDataset
  }
}

export interface IParsedAnswer {
    [question: number]: ICriteriaTurn
}

export interface ITrialMeasureWithName extends TrialMeasures {
    measures: {
      measure_name: string
    } | null
  }

export interface IItemStat {
    stdev: number
    stdevOk: boolean
    mean: number
    median: number
    mode: MathScalarType
    iqr: number
    iqrOk: boolean
}

export interface ICriteriaTurnStats {
      [criteria: number]: IItemStat
  }

export interface IItemSummary {
      [question: number]: ICriteriaTurnStats
  }
