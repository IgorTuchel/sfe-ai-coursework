import fs from "fs";

export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

export async function writeErrorLogs(name, errorLogs, errorMessage) {
  const dateNow = new Date();
  const fileName = `${dateNow.toISOString()}_${name}_errors_${Math.random()
    .toString()
    .slice(2, 6)}.log`;
  errorLogs.unshift(`${name} errors logged at ${dateNow.toISOString()}:\n`);
  fs.writeFileSync(`logs/${fileName}`, errorLogs.join("\n"));
  console.log(
    colors.yellow +
      `** ${errorMessage} - Some errors occurred. Check logs/${fileName} for details.` +
      colors.reset
  );
}
