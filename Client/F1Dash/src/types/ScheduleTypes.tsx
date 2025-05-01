export interface Race_Weekend {
  Country: string;
  Events: Event[];
  IsOver: boolean;
}

export interface Event {
  Name: string;
  Start: Date;
  End: Date;
}
