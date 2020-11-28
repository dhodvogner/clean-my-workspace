let _hideWithRepo = false;
  let _hideWithoutNodeModules = false;
  let _hideWithoutPackageJson = true;
  let _dateHighlightLimit = 3;

  document.querySelector('#dateHighlightLimit').addEventListener('change', evt => {
    _dateHighlightLimit = document.querySelector('#dateHighlightLimit').value;
    fetchData();
  });

  document.querySelector('#hideWithoutNodeModules').addEventListener('change', evt => {
    _hideWithoutNodeModules = document.querySelector('#hideWithoutNodeModules').checked;
    fetchData();
  });

  document.querySelector('#hideWithRepo').addEventListener('change', evt => {
    _hideWithRepo = document.querySelector('#hideWithRepo').checked;
    fetchData();
  });

  document.querySelector('#hideWithoutPackageJson').addEventListener('change', evt => {
    _hideWithoutPackageJson = document.querySelector('#hideWithoutPackageJson').checked;
    fetchData();
  });

  function compareDate(date) {
    const compareDate = moment().subtract(_dateHighlightLimit, 'months');
    const currentDate = moment(date);

    return currentDate.isBefore(compareDate);
  }

  function highlightDate(date) {
    if(compareDate(date)) {
      return `<span style="color: red">${moment(date).format('LLLL')}</span>`;
    }

    return `${moment(date).format('LLLL')}`;
  }

  function calculateProjectPercentage(project) {
    let percantage = 0;
    let numOfCriterias = 4;

    if(!project.hasPackageJson) percantage += 1;
    if(!project.hasNVMRc) percantage += 1;
    if(!project.hasRepo) percantage += 1;
    
    if(compareDate(project.lastModifiedTime) || compareDate(project.lastAccessTime)) {
      percantage += 1;
      numOfCriterias += 1;

      if(project.hasNodeModules) {
        percantage += 1;
      }
    } 
    
    return Math.ceil(percantage / numOfCriterias * 100);
  }

  function render(path, projects) {
    const app = document.querySelector('#app');
    app.innerHTML = '';

    app.innerHTML = `
      <h1 class="subtitle">${path}</h1>
    `;

    projects.forEach(project => {
      const container = document.createElement('article');
      container.classList.add('media');

      const estimate = calculateProjectPercentage(project);
      const estimateClass = (estimate >= 60)  
        ?  'danger' 
        : (estimate >= 30) 
          ? 'warning'
          : 'okay' 

      container.innerHTML = `
        <div class="media-left">
          <span 
            class="project-estimate ${estimateClass}" 
            title="Estimated abandonment"
          >
            ${estimate}%
          </span>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${project.name}</strong> <small> NodeJs: ${project.nodeVersion}</small>
              <br>
              <small>
              .nvmrc: ${project.hasNVMRc ? '✔️' : '✘'} |
              node_modules: ${project.hasNodeModules ? '✔️' : '✘'} |
              package.json: ${project.hasPackageJson ? '✔️' : '✘'} |
              repository: ${project.hasRepo ? '✔️' : '✘'}
              </small>
              <br/><br/>
              <b>Last Access:</b> ${highlightDate(project.lastAccessTime)} <br/>
              <b>Last Modified:</b> ${highlightDate(project.lastModifiedTime)} <br/>
              <b>Created:</b> ${moment(project.birthTime).format('LLLL')} <br/>
            </p>
            <button 
              style="display: ${project.hasNodeModules ? 'block' : 'none'}" 
              id="delete-node-modules-${project.name}"
              class="button is-danger"
              >
                Delete node_modules
            </button>
          </div>
        </div>
      `;

      app.append(container);

      if(project.hasNodeModules) {
        container.querySelector(`#delete-node-modules-${project.name}`).addEventListener('click', () => {
          deleteNodeModules(project);
        });
      }
    });
  }

  function filterHideWithoutNodeModules(d) {
    if (_hideWithoutNodeModules)
    return !(d.hasNodeModules === false)

    return true;
  }

  function filterHasRepo(d) {
    if (_hideWithRepo)
      return !(d.hasRepo === true)

    return true;
  }

  function filterHideWithoutPackageJson(d) {
    if (_hideWithoutPackageJson)
      return !(d.hasPackageJson === false)

    return true;
  }

  function fetchData() {
    fetch('http://localhost:3000/results')
    .then(response => response.json())
    .then(data => {
      render(
        data.path,
        data.projects
          .filter(filterHideWithoutPackageJson)
          .filter(filterHideWithoutNodeModules)
          .filter(filterHasRepo)
      );
    });
  }

  function deleteNodeModules(project) {
    fetch(
      'http://localhost:3000/delete-node-modules',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      }
    ).then(response => {
      fetchData();
      alert(`Delete node_modules of ${project.name}: ${response.statusText}`);
    });
  }

  fetchData();
  