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
  GET_RESULTS_CSV:                 'api/get-trial-results-csv',
  DELETE_TRIAL:                    'api/trials/delete-trial',
  UPDATE_ITEM_TEXT:                'api/trial-items/update-text',
  DELETE_ITEM:                     'api/trial-items/delete-item',
  EDIT_TRIAL_NAME:                 'api/trials/edit-trial-name',
  EDIT_TRIAL_MEASURES_VALUES:      'api/trial-measures/update-measures-values',
  ADD_USER:                        'api/users/add-user',
  DELETE_USER:                     'api/users/delete-user',
  ADD_CRITERIA_DEFAULTS:           'api/trial-criteria-defaults',
  ADD_CRITERIA:                    'api/criteria/add-criteria',
  DELETE_CRITERIA:                 'api/criteria/delete-criteria',
  CHANGE_USER_PASSWORD:            'api/users/change-password',
};

export const NEXT_URL = process.env.NEXT_PUBLIC_HOST_URL;

export const TURNS_COLOR = {
  0: '#268c22',
  1: '#34d72d',
  2: '#d02dd7',
  3: '#d7d02d',
  4: '#2d34d7',
};

export const TRIAL_END_GRAPHS_COLOR = {
  ok:    '#13c256',
  notOk: '#e82923',
};

export const MEASURES_NAMES = {
  STDEV: 'STDEV',
  IQR:   'IQR',
};

export const LINES_INDICATORS_PARAMS = {
  COLOR:            '#0566ed',
  NORMAL_WIDTH:     1,
  ENPHASIZED_WIDTH: 2,
};
