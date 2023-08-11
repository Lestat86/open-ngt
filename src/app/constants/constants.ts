export enum TrialStatus {
    CREATED = 0,
    STARTED = 1,
    COMPLETED = 2,
    EXPORTED = 3
}

export const TrialStatusLabels = {
    [TrialStatus.CREATED]: 'Created',
    [TrialStatus.STARTED]: 'Started',
    [TrialStatus.COMPLETED]: 'Completed',
    [TrialStatus.EXPORTED]: 'Exported',
}
