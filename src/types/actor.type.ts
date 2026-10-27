import { AllCodeValue } from "./allcode.type";

export interface Actor {
  actorId: number;
  actorName: string;
  characterName: string;
  avatarUrl: string;
  slug: string;
  birthDate: string | null;
  shortBio: string | null;
  nationalityActor: AllCodeValue | null;
  genderActor: AllCodeValue | null;
}

export interface FilmActor {
  actor: Actor;
}

export interface ActorDetailRes {
  actors: Actor[];
}