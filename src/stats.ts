/**
 * This is Quirk's stats file and it's how we collect
 * anonymous telemetry.
 *
 * We do this to check that the lights are on and that
 * we didn't break anything. Sometimes when we release
 * a new feature, we'll also use this to see if anyone
 * actually uses it.
 *
 * We also record an aggregate success of each exercise
 * here so we know that we're not making people
 * unhappy or otherwise causing harm to people.
 *
 * The stats here should never be connected to personally
 * identifiable information. They might seem harmless,
 * but for the privacy of the user, we don't ever want
 * "foobar@example.org" to be connected to 4 thoughts
 * a day or something.
 *
 * On the other hand, we try to release some of this
 * information publicly in aggregate. Things like user counts,
 * happiness metrics, etc. We only do this if it
 * preserves the privacy of user though; we shouldn't
 * release info in such a small N that it could potentially
 * identify someone.
 *
 * (Note: we don't necessarily share all financial info
 * publicly due to legal + company risk)
 */

import * as ExponentSegment from "expo-analytics-segment";
import isInDev from "./isInDev";
import dayjs from "dayjs";

export function initExponentSegment() {
  ExponentSegment.initialize({
    androidWriteKey: "ZivFALGI9FH1L4WiAEY3o5PDtKwvLLxB",
    iosWriteKey: "BpLkO0nXEQJUJyjQCqZk5TWawTQN83QC",
  });
  return ExponentSegment;
}

initExponentSegment();

// Don't rename these; it can mess a bunch of stuff down the pipe
export type ScreenType =
  | "form"
  | "help"
  | "intro"
  | "list"
  | "settings"
  | "payments";

/**
 * Screen calls bump a counter every time someone sees a particular screen.
 *
 * **Example Info:**
 * If lots of users don't look at the help screen, maybe it's
 * broken! Similarly, if people use it a _lot_ then maybe we should
 * invest in making it better, because a single trip isn't good
 * enough.
 */
export function screen(val: ScreenType) {
  if (isInDev()) {
    return;
  }
  ExponentSegment.screen(val);
}

export function userDownloaded() {
  ExponentSegment.track("user_downloaded_quirk");
}

export function userGrandfathered() {
  if (isInDev()) {
    return;
  }
  ExponentSegment.track("user_grandfathered");
}

/**
 * Bumps a counter everytime we find a _new_ user. This let's
 * us roughly understand and then share how many downloads Quirk
 * is getting.
 */
export function newuser() {
  if (isInDev()) {
    return;
  }
  ExponentSegment.track("newuser");
}

/**
 * Records if a user finished onboarding. This helps us
 * understand if there's a bug in the onboarding flow,
 * or if it's too long.
 */
export function endedOnboarding() {
  if (isInDev()) {
    return;
  }
  ExponentSegment.track("ended_onboarding");
}

/**
 * Thoughts recorded counter. If this drops, we have a huge
 * bug.
 */
export function thoughtRecorded() {
  if (isInDev()) {
    return;
  }
  ExponentSegment.track("thought_recorded");
}

/**
 * User Started Payment
 * Purpose: The user clicked on the subscription button,
 * but didn't necessarily finish subscribing.
 *
 * If this doesn't match the user_usbscribed
 * numbers, then there's likely a bug.
 */
export function userStartedPayment() {
  ExponentSegment.track("user_started_payment");
}

/**
 * User Encountered Payment Error
 */
export function userEncounteredPaymentError(err: string) {
  ExponentSegment.trackWithProperties("user_encountered_payment_error", {
    error: err,
  });
}

export function userCanceledPayment() {
  ExponentSegment.track("user_canceled_payment");
}

export function userSawApologyNotice() {
  ExponentSegment.track("user_saw_apology_notice");
}

export function userRestoredPurchase() {
  ExponentSegment.track("user_restored_purchase");
}

export function userSetPincode() {
  ExponentSegment.track("user_set_pincode");
}

export function userSharedSuccess() {
  ExponentSegment.track("user_shared_success");
}

export function userDidNotShareSuccess() {
  ExponentSegment.track("user_did_not_shared_success");
}

export function userRepeatedThought() {
  ExponentSegment.track("user_repeated_thought");
}

/**
 * User Subscribed
 */
export function userSubscribed(expirationUnixTimestamp: number) {
  ExponentSegment.trackWithProperties("user_subscribed", {
    expirationDate: dayjs.unix(expirationUnixTimestamp).format(),
  });
}

/**
 * Subscription Verified
 *
 * Purpose: Tracks HOW a person's sub was verified so
 * we can see if local cache actually works. If we're
 * seeing spikes in "online", we'll know that we're
 * using too much data and that the app might
 * be slow for folks.
 */
export function subscriptionVerified(
  method: "cache" | "online" | "grandfathered"
) {
  ExponentSegment.trackWithProperties("subscription_verified", {
    method,
  });
}

/**
 * If there's a spike in expired, there's probably a payment error.
 */
export function subscriptionUnverified(reason: "expired" | "never-bought") {
  ExponentSegment.trackWithProperties("subscription_unverified", {
    reason,
  });
}

/**
 * If there's a spike these, there's probably a payment error.
 */
export function subscriptionGivenForFreeDueToError() {
  ExponentSegment.track("subscription_given_for_free_due_to_error");
}

/**
 * If this drops dramatically, there's a cache bug
 */
export function subscriptionFoundInCache(value: string) {
  ExponentSegment.trackWithProperties("subscription_found_in_cache", {
    value,
  });
}

/**
 * This lets us understand how people fill out the fields,
 * and if people actually understand how the app works.
 */
export function userFilledOutFormField(
  value:
    | "automatic"
    | "distortions"
    | "challenge"
    | "alternative"
    | "followup_note"
) {
  ExponentSegment.track("user_filled_out_" + value);
}

/**
 * This "roughly" let's us understand if our descriptions
 * make sense. If we change the descriptions, and people
 * start selecting a particular distortion less, then
 * it could mean the description is bad.
 */
export function userCheckedDistortion(slug: string) {
  ExponentSegment.track("user_checked_distortion_" + slug);
}

export function userClickedQuirkGuide() {
  ExponentSegment.track("user_clicked_quirk_guide");
}

export function userCantOpenLink() {
  ExponentSegment.track("user_cant_open_link");
}

export function userTurnedOnNotifications() {
  ExponentSegment.track("user_turned_on_notifications");
}

export function userTurnedOffNotifications() {
  ExponentSegment.track("user_turned_off_notifications");
}

export function userReviewed() {
  ExponentSegment.track("user_reviewed");
}

export function userPromptedForReviewWhenSettingCode() {
  ExponentSegment.track("user_prompted_for_review_when_setting_code");
}

export function userPromptedForReviewWhenRecordingPositiveThought() {
  ExponentSegment.track("user_prompted_for_review_when_recording_positive_thought");
}

export function userGaveFeedback() {
  ExponentSegment.track("user_gave_feedback");
}

export function userDismissedFeedback() {
  ExponentSegment.track("user_dismissed_feedback");
}

export function userReadArticle(article: string) {
  ExponentSegment.track("user_read_article " + article);
}

/**
 * Effectiveness metrics
 */

export function userFeltBetter() {
  ExponentSegment.track("user_felt_better");
}

export function userFeltWorse() {
  ExponentSegment.track("user_felt_worse");
}

export function userFeltTheSame() {
  ExponentSegment.track("user_felt_the_same");
}

export function identify(userID: string) {
  ExponentSegment.identify(userID);
}

export function identifyWithTraits(userID: string, traits) {
  ExponentSegment.identifyWithTraits(userID, traits);
}

/**
 * Follow Ups
 */
export function userScheduledFollowUp() {
  ExponentSegment.track("user_scheduled_follow_up");
}

export function userDidNotScheduleFollowUp() {
  ExponentSegment.track("user_did_not_schedule_follow_up");
}

export function userStartedFollowUp() {
  ExponentSegment.track("user_started_follow_up");
}

export function userCompletedFollowUp() {
  ExponentSegment.track("user_completed_follow_up");
}

export function userFeltBetterOnFollowUp() {
  ExponentSegment.track("user_felt_better_on_follow_up");
}

export function userFeltTheSameOnFollowUp() {
  ExponentSegment.track("user_felt_the_same_on_follow_up");
}

export function userFeltWorseOnFollowUp() {
  ExponentSegment.track("user_felt_worse_on_follow_up");
}

export function userReviewedThoughtOnFollowUp() {
  ExponentSegment.track("user_reviewed_thought_on_follow_up");
}

export function userRecordedNewThoughtOnFollowUp() {
  ExponentSegment.track("user_recorded_new_thought_on_follow_up");
}

export function userRequestedPincodeReset(code: string) {
  ExponentSegment.trackWithProperties("user_requested_code", {
    code,
  });
}

export function userFinishedCheckup(mood: "good" | "neutral" | "bad") {
  ExponentSegment.trackWithProperties("user_finished_checkup", {
    mood,
  });
}

export function userDismissedSurvey() {
  ExponentSegment.track("user_dismissed_survey");
}

/**
 * Basically production logs
 * @param properties
 */
export function log(label: string, properties?: object) {
  const args = { label, properties };
  if (isInDev()) {
    console.log(args);
  } else {
    ExponentSegment.trackWithProperties("log", args);
  }
}
