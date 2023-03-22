export const generateTestingDatabaseName = (databaseName: string) => {
  const length = 8;
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `${databaseName}_test_${result}`;
};
