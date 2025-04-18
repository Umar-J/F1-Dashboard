export interface Root {
  //   "CarData.z": string;
  //   ChampionshipPrediction: ChampionshipPrediction;
  //   DriverList: DriverList;
  ExtrapolatedClock: ExtrapolatedClock;
  //   Heartbeat: Heartbeat;
  LapCount: LapCount;
  //   PitLaneTimeCollection: PitLaneTimeCollection;
  //   "Position.z": string;
  //   RaceControlMessages: RaceControlMessages;
  //   SessionData: SessionData;
  SessionInfo: SessionInfo;
  //   TeamRadio: TeamRadio;
  //   TimingAppData: TimingAppData;
  //   TimingData: TimingData;
  //   TimingStats: TimingStats;
  //   TopThree: TopThree;
  TrackStatus: TrackStatus;
  WeatherData: WeatherData;
}

export interface WeatherData {
  TrackTemp: Float32Array;
  AirTemp: Float32Array;
  Humidity: Float32Array;
  Rainfall: Int8Array;
  WindSpeed: Int8Array;
  WindDirection: Int8Array;
}

export interface ExtrapolatedClock {
  Extrapolating: boolean;
  Remaining: string;
  Utc: string;
  _kf: boolean;
}

export interface SessionInfo {
  EndDate: string;
  GmtOffset: string;
  Key: number;
  Meeting: Meeting;
  Name: string;
  Path: string;
  StartDate: string;
  Type: string;
  _kf: boolean;
}

export interface Meeting {
  Country: Country;
  Key: number;
  Location: string;
  Name: string;
  Number: number;
  OfficialName: string;
}

export interface Country {
  Code: string;
  Key: number;
  Name: string;
}

export interface LapCount {
  CurrentLap: number;
  TotalLaps: number;
  _kf: boolean;
}

export interface TrackStatus {
    Message: string
    Status: string
    _kf: boolean
  }
