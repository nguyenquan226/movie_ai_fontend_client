import { AllCodeRow } from "./allcode.type";

export interface Director {
  directorId: number;
  directorName: string;
  story: string;
  birthDate: string;
  genderCode: string;
  nationalityCode: string;
  avatarUrl: string;
  slug: string;
  isMain: boolean;
  genderCodeRL?: AllCodeRow | null;
  nationalityCodeRL?: AllCodeRow | null;
}

export interface FilmDirector {
  director: Director;
}

export interface DirectorRes {
 directors: Director[];
}