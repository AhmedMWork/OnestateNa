export type ApplicationType = 'ADMIN' | 'FACTION_LEADER' | 'FACTION_MEMBER';
export type ApplicationStatus = 'NEW' | 'UNDER_REVIEW' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'WAITLIST' | 'NEEDS_RESUBMIT';
export type QuestionInputType = 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'SELECT' | 'MULTISELECT' | 'RADIO' | 'CHECKBOX' | 'CONSENT' | 'SCALE';

export interface Faction {
  id: string;
  slug: string;
  name_ar: string;
  description_ar?: string;
  min_hours?: number;
  is_open: boolean;
  order_index: number;
}

export interface QuestionOption {
  label: string;
  value: string;
  score?: number;
}

export interface Question {
  id: string;
  application_type: ApplicationType;
  faction_slug: string | null;
  section: string;
  question_key: string;
  title: string;
  description: string | null;
  input_type: QuestionInputType;
  options: QuestionOption[];
  required: boolean;
  order_index: number;
  weight: number;
  correct_answer?: unknown;
  rubric_keywords?: string[];
  is_active: boolean;
}

export interface RuleItem {
  id: string;
  category: string;
  code: string | null;
  title: string;
  body: string;
  penalty: string | null;
  severity: string;
  tags: string[];
}

export interface PublicQuestion extends Omit<Question, 'correct_answer' | 'rubric_keywords'> {}

export interface SubmitPayload {
  applicationType: ApplicationType;
  factionSlug?: string | null;
  answers: Record<string, unknown>;
  deviceHash?: string | null;
  screen?: string | null;
  timezone?: string | null;
}
