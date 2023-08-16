import { Criteria, TrialItem, TrialItemWithCriteria } from "./database.types"

export type IGenericColumn = {
    key: string
    name: string
    renderCell?: (props: any) => any
}

export interface HydratedTrialItemWithCriteria extends TrialItemWithCriteria {
    criteria: Criteria | null
}

export interface HydratedTrialItems extends TrialItem {
    trial_item_with_criteria: HydratedTrialItemWithCriteria[] | null
}
