export interface Word {
	text: string;
	start: number;
	end: number;
	confidence: number;
	speaker: string | null;
}

export interface ContentSafetyLabels {
	status: string;
	results: any[];
	summary: Record<string, any>;
}

export interface IabCategoriesResult {
	status: string;
	results: any[];
	summary: Record<string, any>;
}

export interface VideoTranscriptResponse {
	id: string;
	language_model: string;
	acoustic_model: string;
	language_code: string;
	status: string;
	audio_url: string;
	text: string;
	words: Word[];
	utterances: any | null;
	confidence: number;
	audio_duration: number;
	punctuate: boolean;
	format_text: boolean;
	dual_channel: any | null;
	webhook_url: any | null;
	webhook_status_code: any | null;
	webhook_auth: boolean;
	webhook_auth_header_name: any | null;
	speed_boost: boolean;
	auto_highlights_result: any | null;
	auto_highlights: boolean;
	audio_start_from: any | null;
	audio_end_at: any | null;
	word_boost: any[];
	boost_param: any | null;
	filter_profanity: boolean;
	redact_pii: boolean;
	redact_pii_audio: boolean;
	redact_pii_audio_quality: any | null;
	redact_pii_policies: any | null;
	redact_pii_sub: any | null;
	speaker_labels: boolean;
	content_safety: boolean;
	iab_categories: boolean;
	content_safety_labels: ContentSafetyLabels;
	iab_categories_result: IabCategoriesResult;
	language_detection: boolean;
	language_confidence_threshold: any | null;
	language_confidence: any | null;
	custom_spelling: any | null;
	throttled: boolean;
	auto_chapters: boolean;
	summarization: boolean;
	summary_type: any | null;
	summary_model: any | null;
	custom_topics: boolean;
	topics: any[];
	speech_threshold: any | null;
	speech_model: any | null;
	chapters: any | null;
	disfluencies: boolean;
	entity_detection: boolean;
	sentiment_analysis: boolean;
	sentiment_analysis_results: any | null;
	entities: any | null;
	speakers_expected: any | null;
	summary: any | null;
	custom_topics_results: any | null;
	is_deleted: any | null;
	multichannel: any | null;
}
