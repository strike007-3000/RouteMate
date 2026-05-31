const { spawn } = require('child_process');

const args = process.argv.slice(2);
const command = args[0] || 'dev';

function hasInfisical() {
  try {
    const { spawnSync } = require('child_process');
    // Run infisical --version to check if it exists in the system PATH
    const result = spawnSync('infisical', ['--version'], { shell: true, stdio: 'ignore' });
    return result.status === 0;
  } catch (e) {
    return false;
  }
}

const useInfisical = hasInfisical();

let spawnCmd;
let spawnArgs;

if (useInfisical) {
  console.log('[RouteMate] Infisical CLI detected. Running with Infisical...');
  spawnCmd = 'infisical';
  spawnArgs = ['run', '--', 'next', command, ...args.slice(1)];
} else {
  console.log('[RouteMate] Infisical CLI not found. Falling back to direct next command...');
  spawnCmd = 'next';
  spawnArgs = [command, ...args.slice(1)];
}

const child = spawn(spawnCmd, spawnArgs, { stdio: 'inherit', shell: true });

child.on('close', (code) => {
  process.exit(code === null ? 1 : code);
});

child.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});
