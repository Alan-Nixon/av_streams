const { exec } = require('child_process');
const { join } = require('path');


const chatManagement = join(__dirname, 'chatManagement')
const api_gateway = join(__dirname, 'API_GATEWAY')
const commentManagement = join(__dirname, 'commentManagement/commentService')

function startServer(command, directory) {
    return new Promise((resolve, reject) => {
        console.log(`Starting server in ${directory}...`);
        exec(command, { cwd: directory }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error starting server in ${directory}:`, error);
                reject(error);
            } else if (stderr) {
                console.error(`stderr from ${directory}:`, stderr);
                resolve(stdout);
            } else {
                console.log(`Server in ${directory} started successfully.`);
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}

async function startServers() {
    try {

        startServer("npm start", chatManagement);
        startServer("npm start", api_gateway)
        startServer("python manage.py runserver 8005", commentManagement);
        
        console.log('Both servers started successfully.');

    } catch (error) {
        console.error('Error starting servers:', error);
    }
}

startServers();
