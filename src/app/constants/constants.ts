// eslint-disable-next-line no-shadow
export enum TrialStatus {
    CREATED = 0,
    STARTED = 1,
    COMPLETED = 2,
    EXPORTED = 3,
    TURN_STARTED = 4,
    TURN_ENDED = 5
}

export const TrialStatusLabels = {
  [TrialStatus.CREATED]:      'Created',
  [TrialStatus.STARTED]:      'Started',
  [TrialStatus.COMPLETED]:    'Completed',
  [TrialStatus.EXPORTED]:     'Exported',
  [TrialStatus.TURN_STARTED]: 'New turn started',
  [TrialStatus.TURN_ENDED]:   'New turn ended',
};

export const API_URLS = {
  TRIALS:                          'api/trials',
  TRIAL_MEASURES:                  'api/trial-measures',
  TRIAL_PARTECIPANTS:              'api/trial-partecipants',
  TRIAL_ITEMS:                     'api/trial-items',
  TRIAL_ITEM_WITH_CRITERIA:        'api/trial-item-with-criteria',
  TRIAL_STATUS:                    'api/trial-status',
  TRIAL_ITEMS_ANSWERS:             'api/trial-items-answers',
  TRIAL_INCREMENT_TURN:            'api/trials/increment-turn',
  PARTECIPANT_LOGIN:               'api/partecipants/login',
  PARTECIPANT_SET_SUBMITTED:       'api/partecipants/set-submitted',
  PARTECIPANT_RESET_ALL_SUBMITTED: 'api/partecipants/reset-all-submitted',
};

export const NEXT_URL = process.env.NEXT_PUBLIC_HOST_URL;

export const TURNS_COLOR = {
  1: '#34d72d',
  2: '#d02dd7',
  3: '#d7d02d',
  4: '#2d34d7',
};

export const MEASURES_NAMES = {
  STDEV: 'STDEV',
  IQR:   'IQR',
};
