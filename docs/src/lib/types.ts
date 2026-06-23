export type ApplicationType = 'ADMIN' | 'FACTION_LEADER';
export type ApplicationStatus = 'NEW' | 'UNDER_REVIEW' | 'INTERVIEW_REQUIRED' | 'PRE_ACCEPTED' | 'ACCEPTED' | 'REJECTED' | 'DEFERRED' | 'DUPLICATE' | 'BLOCKED';
export type ReviewLabel = 'VERY_STRONG' | 'GOOD' | 'NEEDS_REVIEW' | 'UNCLEAR' | 'NOT_SUITABLE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type QuestionInputType = 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'SELECT' | 'RADIO' | 'MULTISELECT' | 'CHECKBOX' | 'CONSENT';

export interface Faction {
  id: string;
  slug: string;
  name_ar: string;
  description_ar: string | null;
  icon_name: string | null;
  requirements_ar: string | null;
  is_open: boolean;
  is_visible: boolean;
  order_index: number;
}

export interface QuestionOption { label: string; value: string; }

export interface Question {
  id: string;
  application_type: ApplicationType | 'ALL';
  faction_slug: string | null;
  section: string;
  question_key: string;
  title: string;
  description: string | null;
  input_type: QuestionInputType;
  options: QuestionOption[];
  required: boolean;
  order_index: number;
  is_active: boolean;
  helper_image: string | null;
}

export interface RuleItem {
  id: string;
  category: string;
  code: string | null;
  title: string;
  body: string;
  penalty: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  faction_slug: string | null;
  tags: string[];
  order_index: number;
  is_active: boolean;
}

export interface SubmitPayload {
  applicationType: ApplicationType;
  factionSlug?: string | null;
  answers: Record<string, unknown>;
  deviceHash?: string | null;
  screen?: string | null;
  timezone?: string | null;
  website?: string;
}
