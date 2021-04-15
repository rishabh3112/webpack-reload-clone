//  CORE
export const DEBUG_ENABLED = 'DEBUG_ENABLED' //  Debugger has been enabled
export const DEBUG_DISABLED = 'DEBUG_DISABLED' //  Debugger has been disabled
export const ROUTER_URL_UPDATED = 'ROUTER_URL_UPDATED' // Url was updated by an action or browser navigation
export const ROUTER_URL_REDIRECTED = 'ROUTER_URL_REDIRECTED' // Router was redirected by a reactor, SSE or in some otherway

//  AUTH
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT' //  Client has been logged out
export const LOGIN_REQUEST_STARTED = 'LOGIN_REQUEST_STARTED' //  Client attempted to log in
export const LOGIN_REQUEST_SUCCEEDED = 'LOGIN_REQUEST_SUCCEEDED' //  Server responded with a successful log in response
export const LOGIN_REQUEST_FAILED = 'LOGIN_REQUEST_FAILED' //  Server responded with a failed log in response
export const AUTH_TOKEN_RECEIVED = 'AUTH_TOKEN_RECEIVED' //  Client recieves a token, from server, or local store
export const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED' //  Server responded with a token expired message
export const AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID' //  Server responded with a token invalid message
export const REGISTRATION_REQUEST_STARTED = 'REGISTRATION_REQUEST_STARTED' //  Client attempted to register
export const REGISTRATION_REQUEST_SUCCEEDED = 'REGISTRATION_REQUEST_SUCCEEDED'
export const REGISTRATION_REQUEST_FAILED = 'REGISTRATION_REQUEST_FAILED' //  Server responded with a failed registration response
export const ACCOUNT_NOT_CONFIRMED = 'ACCOUNT_NOT_CONFIRMED' //  Server responded with a response for an unconfirmed account
export const ACCOUNT_VERIFICATION_STARTED = 'ACCOUNT_VERIFICATION_STARTED' // Request for account verification sent
export const ACCOUNT_VERIFICATION_SUCCEEDED = 'ACCOUNT_VERIFICATION_SUCCEEDED' // Account verified successfully
export const ACCOUNT_VERIFICATION_FAILED = 'ACCOUNT_VERIFICATION_FAILED' // Account verification failed

// DATASETS
export const DATASETS_FETCH_STARTED = 'DATASETS_FETCH_STARTED' // Datasets fetch request was initiated
export const DATASETS_FETCH_SUCCEEDED = 'DATASETS_FETCH_SUCCEEDED' // Datasets data has been succesfully fetched from the server
export const DATASETS_FETCH_FAILED = 'DATASETS_FETCH_FAILED' // Server responded with an error to a GET datasets request
export const DATASETS_CLEARED = 'DATASETS_CLEARED' // Datasets data has been cleared and is no longer available
export const DATASETS_OUTDATED = 'DATASETS_OUTDATED' // Datasets data has been marked as stale
export const DATASETS_EXPIRED = 'DATASETS_EXPIRED' // Datasets data has expired and is no longer available

// TRANSFORMATIONS
export const TRANSFORMATIONS_FETCH_STARTED = 'TRANSFORMATIONS_FETCH_STARTED' // Transformations fetch request was initiated
export const TRANSFORMATIONS_FETCH_SUCCEEDED = 'TRANSFORMATIONS_FETCH_SUCCEEDED' // Transformations data has been succesfully fetched from the server
export const TRANSFORMATIONS_FETCH_FAILED = 'TRANSFORMATIONS_FETCH_FAILED' // Server responded with an error to a GET trainings request
export const TRANSFORMATIONS_CLEARED = 'TRANSFORMATIONS_CLEARED' // Transformations data has been cleared and is no longer available
export const TRANSFORMATIONS_OUTDATED = 'TANSFORMATIONS_OUTDATED' // Transformations data has been marked as stale
export const TRANSFORMATIONS_EXPIRED = 'TANSFORMATIONS_EXPIRED' // Transformations data has expired and is no longer available

// TRAININGS
export const TRAININGS_FETCH_STARTED = 'TRAININGS_FETCH_STARTED' // Trainings fetch request was initiated
export const TRAININGS_FETCH_SUCCEEDED = 'TRAININGS_FETCH_SUCCEEDED' // Trainings data has been succesfully fetched from the server
export const TRAININGS_FETCH_FAILED = 'TRAININGS_FETCH_FAILED' // Server responded with an error to a GET trainings request
export const TRAININGS_CLEARED = 'TRAININGS_CLEARED' // Trainings data has been cleared and is no longer available
export const TRAININGS_OUTDATED = 'TRAININGS_OUTDATED' // Trainings data has been marked as stale
export const TRAININGS_EXPIRED = 'TRAININGS_EXPIRED' // Trainings data has expired and is no longer available

// TRAINING
export const TRAINING_CREATION_STARTED = 'TRAINING_CREATION_STARTED' // Fetch for training creation started
export const TRAINING_CREATION_SUCCEEDED = 'TRAINING_CREATION_SUCCEEDED' // Fetch for training creation succeeded
export const TRAINING_CREATION_FAILED = 'TRAINING_CREATION_FAILED' // Fetch for training creation failed
export const COMPATIBLE_DATASETS_FETCH_STARTED = 'COMPATIBLE_DATASETS_FETCH_STARTED' // Compatible dataset fetch started
export const COMPATIBLE_DATASETS_FETCH_SUCCEEDED =
  'COMPATIBLE_DATASETS_FETCH_SUCCEEDED' // Compatible datasets fetch succeeded
export const COMPATIBLE_DATASETS_FETCH_FAILED = 'COMPATIBLE_DATASETS_FETCH_FAILED' // Compatible datasets fetch failed
export const TRANSFORMATION_METADATA_FETCH_STARTED =
  'TRANSFORMATION_METADATA_FETCH_STARTED' // Transformation metadata fetch started
export const TRAINING_LOGS_FETCH_STARTED = 'TRAINING_LOGS_FETCH_STARTED' // Training logs fetch started
export const TRAINING_LOGS_FETCH_SUCCEEDED = 'TRAINING_LOGS_FETCH_SUCCEEDED' // Training logs fetch succeeded
export const TRAINING_LOGS_FETCH_FAILED = 'TRAINING_LOGS_FETCH_FAILED' // Training logs fetch failed

// BRAINS
export const BRAINS_FETCH_REQUESTED = 'BRAINS_FETCH_REQUESTED'
export const BRAINS_FETCH_STARTED = 'BRAINS_FETCH_STARTED' // Trainings fetch request was initiated
export const BRAINS_FETCH_SUCCEEDED = 'BRAINS_FETCH_SUCCEEDED' // Trainings data has been succesfully fetched from the server
export const BRAINS_FETCH_FAILED = 'BRAINS_FETCH_FAILED' // Server responded with an error to a GET trainings request
export const BRAINS_CLEARED = 'BRAINS_CLEARED' // Trainings data has been cleared and is no longer available
export const BRAINS_OUTDATED = 'BRAINS_OUTDATED' // Trainings data has been marked as stale
export const BRAINS_EXPIRED = 'BRAINS_EXPIRED' // Trainings data has expired and is no longer available

// SCORINGS
export const SCORINGS_FETCH_STARTED = 'SCORINGS_FETCH_STARTED' // Scorings fetch request was initiated
export const SCORINGS_FETCH_SUCCEEDED = 'SCORINGS_FETCH_SUCCEEDED' // Scorings data has been succesfully fetched from the server
export const SCORINGS_FETCH_FAILED = 'SCORINGS_FETCH_FAILED' // Server responded with an error to a GET trainings request
export const SCORINGS_CLEARED = 'SCORINGS_CLEARED' // Scorings data has been cleared and is no longer available
export const SCORINGS_OUTDATED = 'SCORINGS_OUTDATED' // Scorings data has been marked as stale
export const SCORINGS_EXPIRED = 'SCORINGS_EXPIRED' // Scorings data has expired and is no longer available

//  NOTIFICATIONS
export const NOTIFICATIONS_FETCH_STARTED = 'NOTIFICATIONS_FETCH_STARTED' //  Notifications fetch request was initiated
export const NOTIFICATIONS_FETCH_SUCCEEDED = 'NOTIFICATIONS_FETCH_SUCCEEDED' // Notifications succesfully fetched from the server
export const NOTIFICATIONS_FETCH_FAILED = 'NOTIFICATIONS_FETCH_FAILED' //  Server responded with an error during notifications fetch
export const NOTIFICATIONS_CLEARED = 'NOTIFICATIONS_CLEARED' //  Notifications data has been cleared and is no longer available
export const NOTIFICATIONS_OUTDATED = 'NOTIFICATIONS_OUTDATED' //  Notifications data has been marked as stale
export const NOTIFICATIONS_EXPIRED = 'NOTIFICATIONS_EXPIRED' //  Notifications data has expired and is no longer available

//  INSIGHT
export const ACTIVE_PROJECT_SET = 'ACTIVE_PROJECT_SET'
export const ACTIVE_DATASOURCE_SET = 'ACTIVE_DATASOURCE_SET' // <--- this was "ACTIVE_PROJECT_SET" for some unknown reason
export const ACTIVE_TRANSFORMATION_SET = 'ACTIVE_TRANSFORMATION_SET'
export const ACTIVE_TRAINING_SET = 'ACTIVE_TRAINING_SET'
export const ACTIVE_SCORING_SET = 'ACTIVE_SCORING_SET'

// USER PREFS
export const USER_PREFS_TABLE_INIT = 'USER_PREFS_TABLE_INIT' // Default table metadata setup for empty pref key
export const USER_PREFS_TABLE_UPDATED = 'USER_PREFS_TABLE_UPDATED' // User changed table metadata
export const USER_PREFS_UPDATED = 'USER_PREFS_UPDATED' // User changed preferences

// PIPELINE
export const PIPELINE_CONFIGURATION_SET = 'PIPELINE_SET' // Pipeline configuration was set with or without a dataset array and a starting pipeline config
export const PIPELINE_UPDATED = 'PIPELINE_UPDATED' // Complete pipeline updated
export const DATASET_CHOSEN = 'DATASET_CHOSEN' // User chose a dataset in the appropriate dataset slot
export const PIPELINE_CONFIG_BOX_INSERTED = 'PIPELINE_CONFIG_BOX_INSERTED' // New transformation box inserted into pipeline config
export const PIPELINE_CONFIG_BOX_REMOVED = 'PIPELINE_CONFIG_BOX_REMOVED' // Transformation box removed from the pipeline config
export const PIPELINE_CONFIG_BOX_SELECTED = 'PIPELINE_CONFIG_BOX_SELECTED' // User has selected a box
// export const PIPELINE_BOXES_DESELECTED = 'PIPELINE_BOXES_DESELECTED' // User deselected boxes
export const PIPELINE_CONFIG_MODE_ENTERED = 'PIPELINE_CONFIG_MODE_ENTERED' // User clicked onto a box to configure it
export const PIPELINE_CONFIG_BRANCHES_SWAPPED = 'PIPELINE_CONFIG_BRANCHES_SWAPPED' // User swapped branches above a join/concat box horizontally
export const PIPELINE_CONFIG_BOX_SPEC_UPDATED = 'PIPELINE_CONFIG_BOX_SPEC_UPDATED' // User updated the spec of a specific box
export const PIPELINE_STATE_SET_TO_IDLE = 'PIPELINE_STATUS_SET_TO_IDLE' // Reducer set pipeline state to idle (processing, committing, shouldCommit, id = null) due to a not-full dataset array
export const PIPELINE_COMMITTED = 'PIPELINE_COMMITTED' // Sent a request to the server to commit a pipeline
export const PIPELINE_PROCESSING_STARTED = 'PIPELINE_PROCESSING_STARTED' // Received a response from the server with the id of the pipeline being committed
export const PIPELINE_PROCESSING_FINISHED = 'PIPELINE_PROCESSING_FINISHED' // Received a response from the server with a meta structure
export const PIPELINE_PROCESSING_FAILED = 'PIPELINE_PROCESSING_FAILED' // Server could not parse the pipeline config sent in a previous commit request
export const PIPELINE_ELEMENT_FINISHED = 'PIPELINE_ELEMENT_FINISHED' // Received a SSE due to a box element succeding the calculation step (meta,stats, etc)
export const PIPELINE_ELEMENT_FAILED = 'PIPELINE_ELEMENT_FAILED' // Received a SSE due to a box element failing the calculation step (error)

// CHARTDATA
export const CHARTDATA_DATASETIDS_UPDATED = 'CHARTDATA_DATASETIDS_UPDATED' // Dataset IDs array updated
export const CHARTDATA_FETCH_STARTED = 'CHARTDATA_FETCH_STARTED' // Data fetch initiated

// CSV UPLOAD
export const UPLOAD_PREPROCESSING_STARTED = 'UPLOAD_PREPROCESSING_STARTED' // Request for upload route sent to server
export const UPLOAD_PREPROCESSING_SUCCEEDED = 'UPLOAD_PREPROCESSING_SUCCEEDED' // Received a route for file upload
export const UPLOAD_PREPROCESSING_FAILED = 'UPLOAD_PREPROCESSING_FAILED' // Server didn't allocate a route for file upload
export const FILE_TYPIFICATION_STARTED = 'FILE_TYPIFICATION_STARTED' // Started typification of data
export const FILE_TYPIFICATION_SUCCEEDED = 'FILE_TYPIFICATION_SUCCEEDED' // Data was typified
export const FILE_TYPIFICATION_FAILED = 'FILE_TYPIFICATION_FAILED' // Failed while typifing
export const FILE_UPLOAD_STARTED = 'FILE_UPLOAD_STARTED' // Upload started
export const FILE_UPLOAD_PROGRESSED = 'FILE_UPLOAD_PROGRESSED' //Upload progressed
export const FILE_UPLOAD_SUCCEEDED = 'FILE_UPLOAD_SUCCEEDED' // Upload was successful
export const FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED' // Upload was unsuccessful
export const FILE_TYPIFIED = 'FILE_TYPIFIED' // Data was typified
export const UPLOAD_FILE_ADDED = 'UPLOAD_FILE_ADDED' // Added a file to configure and prepare for upload
export const UPLOAD_DATA_PARSE_STEP = 'UPLOAD_DATA_PARSE_STEP' // Papa parsed a row of the upload file data
// export const UPLOAD_DATA_PARSED = 'UPLOAD_DATA_PARSED' // Papa parsed the upload file data
export const UPLOAD_FILE_REPARSE_STARTED = 'UPLOAD_FILE_REPARSE_STARTED' // User changed the parse config issuing a new parse
export const UPLOAD_CONFIGURATION_UPDATED = 'UPLOAD_CONFIGURATION_UPDATED' // User updated the upload file configuration (prepared for upload)
export const UPLOAD_ENTITY_REMOVED = 'UPLOAD_ENTITY_REMOVED' // User removed an upload entity

// SSE
export const SSE_CONNECTION_ESTABLISHED = 'SSE_CONNECTION_ESTABLISHED' // SSE connection request was sent from client to the server
export const SSE_CONNECTION_TERMINATED = 'SSE_CONNECTION_TERMINATED' // SSE connection was terminated either due to network error or client action
export const SSE_CONNECTION_ERROR_RECIEVED = 'SSE_CONNECTION_ERROR_RECIEVED' // Recieved an ERROR event on the SSE channel

// RESOURCE DATA
export const RESOURCE_REQUEST_REGISTERED = 'RESOURCE_REQUEST_REGISTERED' // A component filed a request for resource data (datasource, scoring, etc)
export const RESOURCE_REQUEST_PAGINATION_SET = 'RESOURCE_REQUEST_PAGINATION_SET' // Resource request pagination configuration data was modified
export const RESOURCE_REQUEST_SORT_SET = 'RESOURCE_REQUEST_SORT_SET' // Resource request sort configuration data was modified
export const RESOURCE_PREPARATION_REGISTERED = 'RESOURCE_PREPARATION_REGISTERED' // Resource preparation request was registered by the reactor
export const RESOURCE_PREPARATION_REQUEST_STARTED =
  'RESOURCE_PREPARATION_REQUEST_STARTED' // Resource preparation request was initiated
export const RESOURCE_PREPARATION_REQUEST_FAILED =
  'RESOURCE_PREPARATION_REQUEST_FAILED' // Resource preparation was not prepared due to an error
export const RESOURCE_PREPARATION_REQUEST_SUCCEEDED =
  'RESOURCE_PREPARATION_REQUEST_SUCCEEDED' // Resource was prepared and is ready for use in the view service
export const RESOURCE_REQUEST_DATA_FETCH_STARTED =
  'RESOURCE_REQUEST_DATA_FETCH_STARTED' // Resource request data fetch request was initiated
export const RESOURCE_REQUEST_DATA_FETCH_SUCCEEDED =
  'RESOURCE_REQUEST_DATA_FETCH_SUCCEEDED' // Resource request data was successfuly fetched from the server
export const RESOURCE_REQUEST_DATA_FETCH_FAILED =
  'RESOURCE_REQUEST_DATA_FETCH_FAILED' // Server responded with an error to a resource request data fetch

// PIPELINE MANAGER
export const ACTIVE_PIPELINE_CHANGE_REQUESTED = 'ACTIVE_PIPELINE_CHANGE_REQUESTED' // New pipeline has been requested for handling
export const ACTIVE_PIPELINE_CHANGE_ACCEPTED = 'ACTIVE_PIPELINE_CHANGE_ACCEPTED' // Pending pipeline was accepted by the Pipeline Manager
export const ACTIVE_PIPELINE_CHANGE_REJECTED = 'ACTIVE_PIPELINE_CHANGE_REJECTED' // Pending pipeline was rejected by the Pipeline Manager
export const ACTIVE_PIPELINE_DISCARDED = 'ACTIVE_PIPELINE_DISCARDED' // Current pipeline was discarded by the Pipeline Manager
export const ACTIVE_PIPELINE_SAVED = 'ACTIVE_PIPELINE_SAVED' // Current pipeline was saved by the Pipeline Manager
export const PIPELINE_MANAGER_ACTIVATED = 'PIPELINE_MANAGER_ACTIVATED' // Pipeline Manager has been activated (maximized, shown)
export const PIPELINE_MANAGER_DEACTIVATED = 'PIPELINE_MANAGER_DEACTIVATED' // Pipeline Manager has been deactivated (minimized, hidden)

export const ACTIVE_TRAINING_CHANGE_REQUESTED = 'ACTIVE_TRAINING_CHANGE_REQUESTED' // New training wizard has been requested
export const ACTIVE_TRAINING_CHANGE_ACCEPTED = 'ACTIVE_TRAINING_CHANGE_ACCEPTED' // Pending training wizard change has been accepted
export const ACTIVE_TRAINING_CHANGE_REJECTED = 'ACTIVE_TRAINING_CHANGE_REJECTED' // Pending training wizard change has been rejected
export const ACTIVE_TRAINING_DISCARDED = 'ACTIVE_TRAINING_DISCARDED' // Current training wizard has been discarded
export const TRAINING_WIZARD_ACTIVATED = 'TRAINING_WIZARD_ACTIVATED' // Training wizard has been activated (maximized, shown)
export const TRAINING_WIZARD_DEACTIVATED = 'TRAINING_WIZARD_DEACTIVATED' // Training wizard has been deactivated (minimized, hidden)
export const TRAINING_WIZARD_NEXT_STEP = 'TRAINING_WIZARD_NEXT_STEP' // Training wizard has moved to the next step in the process
export const TRAINING_WIZARD_PREVIOUS_STEP = 'TRAINING_WIZARD_PREVIOUS_STEP' // Training wizard has reverted to the previous step in the process
export const TRAINING_WIZARD_DATASETS_UPDATED = 'TRAINING_WIZARD_DATASETS_UPDATED' // Training wizard datasets array has been updated
export const TRAINING_WIZARD_PIPELINE_UPDATED = 'TRAINING_WIZARD_PIPELINE_UPDATED' // Training wizard pipeline has been updated
export const TRAINING_WIZARD_SPEC_UPDATED = 'TRAINING_WIZARD_SPEC_UPDATED' // Training wizard pipeline has been updated
export const TRAINING_WIZARD_NAME_UPDATED = 'TRAINING_WIZARD_NAME_UPDATED' // Training wizard title has been changed
export const TRAINING_WIZARD_PIPELINE_COMMITED = 'TRAINING_WIZARD_PIPELINE_COMMITED' // Training wizard pipeline has been commited
export const TRAINING_START_REQUEST_STARTED = 'TRAINING_START_REQUEST_STARTED'
export const TRAINING_START_REQUEST_SUCCEEDED = 'TRAINING_START_REQUEST_SUCCEEDED'
export const TRAINING_START_REQUEST_FAILED = 'TRAINING_START_REQUEST_FAILED'

export const ACTIVE_SCORING_CHANGE_REQUESTED = 'ACTIVE_SCORING_CHANGE_REQUESTED'
export const ACTIVE_SCORING_CHANGE_ACCEPTED = 'ACTIVE_SCORING_CHANGE_ACCEPTED'
export const ACTIVE_SCORING_CHANGE_REJECTED = 'ACTIVE_SCORING_CHANGE_REJECTED'
export const ACTIVE_SCORING_DISCARDED = 'ACTIVE_SCORING_DISCARDED'
export const SCORING_WIZARD_ACTIVATED = 'SCORING_WIZARD_ACTIVATED'
export const SCORING_WIZARD_DEACTIVATED = 'SCORING_WIZARD_DEACTIVATED'
export const SCORING_WIZARD_NEXT_STEP = 'SCORING_WIZARD_NEXT_STEP'
export const SCORING_WIZARD_PREVIOUS_STEP = 'SCORING_WIZARD_PREVIOUS_STEP'
export const SCORING_WIZARD_TRAINING_UPDATED = 'SCORING_WIZARD_TRAINING_UPDATED'
export const SCORING_WIZARD_TRAINING_META_INITIALIZED =
  'SCORING_WIZARD_TRAINING_META_INITIALIZED'
export const SCORING_WIZARD_BRAINS_UPDATED = 'SCORING_WIZARD_BRAINS_UPDATED'
export const SCORING_WIZARD_DATASETS_UPDATED = 'SCORING_WIZARD_DATASETS_UPDATED'
export const SCORING_WIZARD_SPEC_UPDATED = 'SCORING_WIZARD_SPEC_UPDATED'
export const SCORING_WIZARD_NAME_UPDATED = 'SCORING_WIZARD_NAME_UPDATED'
export const SCORING_WIZARD_PIPELINE_COMMITED = 'SCORING_WIZARD_PIPELINE_COMMITED'
export const SCORING_START_REQUEST_STARTED = 'SCORING_START_REQUEST_STARTED'
export const SCORING_START_REQUEST_SUCCEEDED = 'SCORING_START_REQUEST_SUCCEEDED'
export const SCORING_START_REQUEST_FAILED = 'SCORING_START_REQUEST_FAILED'
