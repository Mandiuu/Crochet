let stitchCount = 0;
let roundCount = 1;
let currentProject = '';

// Load projects when the page loads
window.addEventListener('load', loadProjectList);

// Event listeners for key actions and project buttons
document.addEventListener('keydown', handleKeyPress);
document.getElementById('projectSelect').addEventListener('change', loadProgress);
document.getElementById('newProjectButton').addEventListener('click', createNewProject);
document.getElementById('saveProjectButton').addEventListener('click', saveProject);
document.getElementById('clearStitchesButton').addEventListener('click', clearStitches);
document.getElementById('deleteProjectButton').addEventListener('click', deleteProject);

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        saveRoundHistory(roundCount);
        roundCount++;
        stitchCount = 0;

        document.getElementById('roundCount').innerText = roundCount;
        document.getElementById('stitchCount').innerText = stitchCount;
        document.getElementById('stitchDisplay').innerHTML = ''; // Clear the current round's stitches

        saveProject();
    } else if (event.key === 'Backspace') {
        if (stitchCount > 0) {
            stitchCount--;
            document.getElementById('stitchCount').innerText = stitchCount;
            const stitchDisplay = document.getElementById('stitchDisplay');
            stitchDisplay.removeChild(stitchDisplay.lastChild);
        }
    } else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        stitchCount++;
        document.getElementById('stitchCount').innerText = stitchCount;
        const dot = document.createElement('div');
        dot.classList.add('stitch-dot');
        document.getElementById('stitchDisplay').appendChild(dot);
    }
}

function createNewProject() {
    const projectName = document.getElementById('projectSelect').value;
    if (projectName) {
        currentProject = projectName;
        stitchCount = 0;
        roundCount = 1;
        document.getElementById('stitchCount').innerText = stitchCount;
        document.getElementById('roundCount').innerText = roundCount;
        document.getElementById('stitchDisplay').innerHTML = '';
        document.getElementById('roundHistory').innerHTML = '';
        saveProject();
        alert(`New project "${currentProject}" created!`);
    } else {
        alert("Please select a project from the dropdown to create.");
    }
}

function saveProject() {
    if (currentProject) {
        const projectData = {
            stitchCount,
            roundCount,
            roundHistory: document.getElementById('roundHistory').innerHTML,
            currentStitchDisplay: document.getElementById('stitchDisplay').innerHTML
        };
        localStorage.setItem(`project_${currentProject}`, JSON.stringify(projectData));
        alert(`Project "${currentProject}" saved successfully!`);
    } else {
        alert("No project selected. Please create or select a project first.");
    }
}

function loadProjectList() {
    const projectSelect = document.getElementById('projectSelect');
    projectSelect.innerHTML = '<option value="" disabled selected>Select Project</option>';

    // Add predefined projects (Project 1 to Project 20)
    for (let i = 1; i <= 20; i++) {
        const predefinedOption = document.createElement('option');
        predefinedOption.value = `Project ${i}`;
        predefinedOption.textContent = `Project ${i}`;
        projectSelect.appendChild(predefinedOption);
    }

    // Load saved projects from localStorage and add them to the dropdown
    for (const key in localStorage) {
        if (key.startsWith('project_')) {
            const projectName = key.replace('project_', '');
            if (![...projectSelect.options].some(option => option.value === projectName)) {
                const savedOption = document.createElement('option');
                savedOption.value = projectName;
                savedOption.textContent = projectName;
                projectSelect.appendChild(savedOption);
            }
        }
    }
}

function loadProgress() {
    const projectName = document.getElementById('projectSelect').value;
    if (projectName) {
        currentProject = projectName;
        const savedData = localStorage.getItem(`project_${currentProject}`);
        if (savedData) {
            const projectData = JSON.parse(savedData);
            stitchCount = projectData.stitchCount;
            roundCount = projectData.roundCount;
            document.getElementById('stitchCount').innerText = stitchCount;
            document.getElementById('roundCount').innerText = roundCount;
            document.getElementById('roundHistory').innerHTML = projectData.roundHistory || '';
            document.getElementById('stitchDisplay').innerHTML = projectData.currentStitchDisplay || '';
        } else {
            stitchCount = 0;
            roundCount = 1;
            document.getElementById('stitchCount').innerText = stitchCount;
            document.getElementById('roundCount').innerText = roundCount;
            document.getElementById('roundHistory').innerHTML = '';
            document.getElementById('stitchDisplay').innerHTML = '';
        }
    }
}

function saveRoundHistory(roundNumber) {
    const roundEntry = document.createElement('div');
    roundEntry.classList.add('round-entry');
    roundEntry.innerHTML = `<strong>Round ${roundNumber}:</strong> ${stitchCount} stitches`;
    document.getElementById('roundHistory').appendChild(roundEntry);

    saveProject();
}

function clearStitches() {
    stitchCount = 0;
    document.getElementById('stitchCount').innerText = stitchCount;
    document.getElementById('stitchDisplay').innerHTML = '';
}

function deleteProject() {
    if (currentProject) {
        if (confirm(`Are you sure you want to delete the project "${currentProject}"?`)) {
            localStorage.removeItem(`project_${currentProject}`);
            currentProject = '';
            stitchCount = 0;
            roundCount = 1;
            document.getElementById('stitchCount').innerText = stitchCount;
            document.getElementById('roundCount').innerText = roundCount;
            document.getElementById('stitchDisplay').innerHTML = '';
            document.getElementById('roundHistory').innerHTML = '';
            loadProjectList();
            alert("Project deleted successfully!");
        }
    } else {
        alert("No project selected.");
    }
}
