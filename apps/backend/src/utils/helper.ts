function padTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

export const formatDate = (
  date: Date,
  dateDiveder: string = "-"
): [string, string] => {
  return [
    [
      date.getFullYear(),
      padTwoDigits(date.getMonth() + 1),
      padTwoDigits(date.getDate()),
    ].join(dateDiveder),

    [
      padTwoDigits(date.getHours()),
      padTwoDigits(date.getMinutes()),
      padTwoDigits(date.getSeconds()),
    ].join(":"),
  ];
};
