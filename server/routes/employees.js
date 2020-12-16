var express = require('express');
var router = express.Router();
const axios = require('axios').default;
// const Forecast = require('forecast-promise');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  // const Forecast = require('forecast-promise');
  const forecast = {
    api: 'https://api.forecastapp.com',
    accountId: '',
    token: '',
  };

  const forecastOptions = {
    headers: {
      'Forecast-Account-Id': forecast.accountId,
      Authorization: `Bearer ${forecast.token}`,
    }
  }


  const getLiveAssignments = () => {
    return axios.get(forecast.api + '/assignments', forecastOptions)
      .then((response) => {
        const data = response.data.assignments;
        let liveAssignments = [];
        let assignmentsWithPeople = [];
        let liveCount = 0;
        const today = new Date();

        for (let i = 0, len = data.length; i < len; i++) {
          let endDate = new Date(data[i].end_date);

          if (endDate > today) {
            liveCount++;
            liveAssignments.push(data[i]);
          }

        }

        return liveAssignments;
      });
  }

  const getPeople = (assignments) => {

    return axios.get(forecast.api + '/people/', forecastOptions)
      .then(response => {
        console.log('got some folks');
        // Loop over assignments
        for (let i = 0, len = assignments.length; i < len; i++) {
          // For each assignment, I guess we loop over all the people to see if
          // anyone matches the person_id.
          for (let j = 0, len2 = response.data.people.length; j < len2; j++) {
            if (response.data.people[j].id === assignments[i].person_id) {
              assignments[i].person = response.data.people[j];
            }
          }
        }

        return assignments;

      });

  }

  const getProjects = (assignments) => {
    return axios.get(forecast.api + '/projects/', forecastOptions)
      .then(response => {
        const today = new Date();
        for (let i = 0, len = assignments.length; i < len; i++) {
          // For each assignment, I guess we loop over all the projects to see if
          // anyone matches the person_id.
          for (let j = 0, len2 = response.data.projects.length; j < len2; j++) {
            if (response.data.projects[j].id === assignments[i].project_id) {
              assignments[i].project = response.data.projects[j];
            }
          }
        }

        return assignments;
      });
  }

  getLiveAssignments()
    .then(assignments => getPeople(assignments)
          .then(assignmentsWithPeople => getProjects(assignmentsWithPeople)
            .then((assignmentsWithPeopleAndProjects) => {
              console.log('assignments with people', assignmentsWithPeopleAndProjects);
              console.log('now this runs');

              res.json(assignmentsWithPeopleAndProjects);
            })));


});

module.exports = router;
