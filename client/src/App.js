import { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    assignments: [],
    sortedProjects: [],
    sortedPeople: [],
  }
  componentDidMount() {
    fetch('/employees')
      .then(res => {
        console.log('client response?', res);
        return res.json();
      })
      .then(assignments => {
        console.log('assignments?', assignments);
        this.setState({
          assignments,
          sortedProjects: this.sortAssignmentsByProject(assignments),
          sortedPeople: this.sortAssignmentsByPeople(assignments)
        });
      });
  }
  sortAssignmentsByProject(assignments) {
    let projects = [{id: 1, people: [{first_name: 'test'}]}];
    let count = 0;
    for (let i = 0, len = assignments.length; i < len; i++) {

      if (projects.some(p => p.id === assignments[i].project_id)) {
        // This project is already in our projects array, just add the person.
        const key = projects.findIndex(project => project.id === assignments[i].project_id);
        projects[key].people.push(assignments[i].person);
      } else {
        // This project isn't in our projects array, add the data and the first person.
        let newProject = {}
        newProject.id = assignments[i].project_id;
        newProject.name = assignments[i].project.name;
        newProject.end_date = assignments[i].project.end_date;
        newProject.start_date = assignments[i].project.start_date;
        newProject.people = [assignments[i].person];
        projects.push(newProject);
      }

    }
    return projects;
  }
  sortAssignmentsByPeople(assignments) {
    let people = [{id: 1, projects: [{id: 1}]}];
    let count = 0;
    for (let i = 0, len = assignments.length; i < len; i++) {

      if (people.some(p => p.id === assignments[i].person_id)) {
        // This person is already in our people array, just add the project.
        const key = people.findIndex(people => people.id === assignments[i].person_id);
        people[key].projects.push(assignments[i].project);
      } else {
        // This person isn't in our people array, add the data and the first project.
        let newPerson = {}
        newPerson.id = assignments[i].person_id;
        newPerson.name = `${assignments[i].person.first_name} ${assignments[i].person.last_name}`;
        newPerson.email = assignments[i].person.email;
        newPerson.projects = [assignments[i].project];
        people.push(newPerson);
      }

    }
    return people;

  }
  render() {
    return (
      <div className="App">
        <h1>Assignments</h1>
        {this.state.sortedPeople.map(person =>
            <div key={person.id} className="person">
              <div className="person__name">{person.name}</div>
              <div className="person__projects">
              {person.projects.map(project =>
                  <li key={project.id + '_' + Math.random()}>{project.name}</li>
              )}
              </div>
            </div>
        )}
      </div>
    );	    
  };
}
        // {this.state.assignments.map(assignments =>
        //     <div key={assignments.id}>{assignments.person.first_name} {assignments.person.last_name}</div>
        // )}

export default App;
