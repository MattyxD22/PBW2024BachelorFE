export type clickupTaskType = {
  duration: {
    hours: number;
    minutes: number;
  };
  formattedDate: string;
  dateLogged: string; // it should be number, but it throws "invalid date" when creating new date
  loggedBy: string;
  taskTitle: string;
};
