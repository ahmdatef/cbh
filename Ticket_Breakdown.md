# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions
1. Used database is MySQL.
2. Record IDs are numeric, BIGINT to be able to hold large scale of records.
3. Effort estimations would be in time, since the story points are relative to a whole squad's evaluation, and burning average.
### Givens

Data is saved in the database in:
1. Facilities Table, which has the following minimum fields:
  a. `facility_id` of type BIGINT
2. Agents Table, which has the following minimum fields:
  a. `facility_id` of type BIGINT
  b. `agent_id` of type BIGINT (internal database id)
3. Shifts table, which has the following minumum fields:
  a. `facility_id` of type BIGINT
  b. `agent_id` of type BIGINT
  c. `shift_id` of type BIGINT
  d. `duration` of type MEDIUMINT (either 2 fields describing start and end times, or start and duration. For simplicity will assume that the duration already exists on the table)

Along with 2 functions:
```
@typedef {{
  id: number,
  duration: number,
  agent: {
    id: number,
    metadata: object
  }
}} EnrichedShift
```
```
/**
Returns all Shifts worked that quarter, including some metadata about the Agent assigned to each
@param {number} facility_id
@returns {EnrichedShift[]}
function getShiftsByFacility(facility_id) {
  // implementation
}
```
```
/**
Converts them into a PDF which can be submitted by the Facility for compliance.
@param {EnrichedShift[]} facility_shifts
@returns {File}
function generateReport(facility_shifts) {
  // implementation
}
```

### Tasks

#### Add the ability for Facilities to attach a custom ID to each of their agents at create request

##### Summary
Facilities need to be able to create agents with or without a custom ID.

##### Acceptance Criteria
- Frontend:
  - Field should be shown in the frontend client, with the label "Custom Id".
  - Field should be optional.
  - Field should be a valid alpha-numeric string with allowed special characters @#&_%-$ and maximum length of 30 characters.
- Backend:
  - A nullabe column should be added to the Agents table schema named `custom_id` with type set to VARCHAR(30).
  - A migration script should be added to assure that the above table alteration is automated on production.
  - An optional field named `customer_id` should be accepted at the create REST controller and passed as it is after validation; alpha-numeric with allowed special characters @#&_%-$ and maximum length of 30 characters.

##### Technical Details
The current existing API for agents creation is as follows:
- Method: POST
- Path: /facilities/{facility_id}/agents
- Request JSON Body: {
  "metadata": JSON Object
}
- Response Status Code: 201
- Response JSON Body: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": Number
}

For this feature, we need to add a new field called `custom_id` in the JSON Body. So:
- The new Request JSON Body should look like this: {
  "metadata": JSON Object,
  "custom_id": Optional String
}
- The new Response JSON Body should look like this: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": Number,
  "custom_id": Optional String
}

##### Effort Estimation
Around 2 days.


#### Add the ability for Facilities to update the custom ID to each of their agents

##### Summary
Facilities need to be able to update the custom ID -or even attach one if not existing- for each agent.


##### Acceptance Criteria
- Frontend:
  - The "Custom Id" field should be shown in the frontend client, with the current value shown inside of it (empty if null).
  - Field should be optional, facilities can choose to fill it or continue without it.
  - Facilities can clear the field, in this case the field should be deleted in the backend and set to NULL.
  - Field should be a valid alpha-numeric string with allowed special characters @#&_%-$ and maximum length of 30 characters.
- Backend:
  - An optional field named "customer_id" should be accepted at the update REST controller and passed as it is after validation; alpha-numeric with allowed special characters @#&_%-$ and maximum length of 30 characters.

##### Technical Details
The current existing API for agents creation is as follows:
- Method: PUT
- Path: /facilities/{facility_id}/agents/{agent_id}
- Request JSON Body: {
  "metadata": JSON Object
}
- Response Status Code: 200
- Response JSON Body: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": Number
}

For this feature, we need to add a new field called `custom_id` in the JSON Body. So:
- The new Request JSON Body should look like this: {
  "metadata": JSON Object,
  "custom_id": Optional String
}
- The new Response JSON Body should look like this: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": Number,
  "custom_id": Optional String
}

##### Effort Estimation
Around 1 day.


#### Add the ability for Facilities to retrieve the custom ID for each agent

##### Summary
Facilities need to be able to view the custom ID -if existing- for each agent.

##### Acceptance Criteria
- Frontend:
  - A new row should be added in the agent details screen to show the `custom_id` field.
  - The new row should be labeled "Custom Id", with the current value of the `custom_id` displayed in it.
  - If the current value of the `custom_id` is NULL, "Empty" should be displayed in value place.
- Backend:
  - A new variable need to be added to the Agent DTO at the details endpoint to hold the custom_id's value.
  - It should be named `custom_id` as well.

##### Technical Details
The current existing API for agents creation is as follows:
- Method: GET
- Path: /facilities/{facility_id}/agents/{agent_id}
- Response Status Code: 200
- Response JSON Body: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": JSON Object
}

For this feature, we need to add a new field called `custom_id` in the response JSON Body. So the new Response JSON Body should look like this: {
  "facility_id": Number,
  "agent_id": Number,
  "metadata": JSON Object,
  "custom_id": Optional String
}

##### Effort Estimation
Around 1 day.


#### [BE] Add agent's custom IDs to the generated report
This is a backend only task.

##### Summary
Facilities need to be able to view identify the agents with their custom ids if existing.

#### Requirements
- Backend:
  - Update the `getShiftsByFacility` function implementation to return the `custom_id` inside the `shift.agent.id`.
  - If the `custom_id` field is NULL, we should fallback to the internal database id.

#### Technical Details
- Shape of `EnrichedShift` is:
  ```
  {
    "id": number,
    "duration": number,
    "agent": {
      "id": number, // internal database id
      "metadata": object
    }
  }
  ```
- The shape should stay the same after the new implementation.
- No changes should be appended to the current endpoint's contract.

##### Effort Estimation
Around 1 day.

