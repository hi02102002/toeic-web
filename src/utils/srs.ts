/**
 * An approximation of the Anki algorithm:
 *
 * This is a naive implementation of Anki's algorithm. This is not 100% accurate and
 * was put together based on documentation other folks wrote up on the web. Anki's
 * scheduling algorithm code is tied very closely to its data model, so it's a bit
 * complicated to walk through.
 *
 * Like SM-2, Anki's algorithm uses a 5.0 scale for measuring how well you remember a
 * card during a lesson. "Failed" cards get a 2.0 score, cards you got right but had
 * difficulty remember get 3.0, "good" cards get 4.0, and "easy" cards get 5.0.
 *
 * Here are the general notes about how the algorithm works.
 *
 * - initial 'n' values use short (less than 24h) intervals this is also known as the
 *   "learning" phase during the learning phase, the efactor is not affected this
 *   also applies if a card goes back into "re-learning"
 * - first repetition is in 1 minute, 2nd in 10, 3rd 24h
 * - cards you answer late, but still get right are given an efactor boost
 * - "easy" cards get an additional boost to efactor (0.15) so that the interval gets
 *   stretched out more for those cases
 * - cards that are marked for "again" (i.e. failing) have their efactor reduced by 0.2
 * - hard cards (score of 3) have efactor reduced by 0.15 and interval is increased
 *   by 1.2 instead of the efactor
 * - score of 4.0 (good) does not affect efactor
 * - a small amount of "fuzz" is added to interval to make sure the same cards aren't
 *   reviewed together as a group
 */

import { TFlashcard } from '@/types';
import dayjs from 'dayjs';
export type TEvaluation = {
   score: 2 | 3 | 4 | 5;
   lateness: number;
};

export type TPrevious = {
   n: TFlashcard['n'];
   efactor: TFlashcard['efactor'];
   interval: TFlashcard['interval'];
};
type TSrsFunc = (previous: TPrevious, evaluation: TEvaluation) => TPrevious;

// https://freshcardsapp.com/srs/write-your-own-algorithm.html
// freshcardsapp.com/srs/simulator/
/**
 *
 * @param previous
 * @param evaluation
 * @returns { n: number, efactor: number, interval: number}
 * @description The algorithm is based on the SM-2 algorithm, but with some modifications.
 * @source https://freshcardsapp.com/srs/write-your-own-algorithm.html
 * @source https://freshcardsapp.com/srs/simulator/
 */
const srsFunc: TSrsFunc = (previous, evaluation) => {
   var n, efactor, interval;

   if (previous == null) {
      previous = { n: 0, efactor: 2.5, interval: 0.0 };
   }

   if (previous.n < 3) {
      // Still in learning phase, so do not change efactor
      efactor = previous.efactor;

      if (evaluation.score < 3) {
         // Failed, so force re-review in 30 minutes and reset n count
         n = 0;
         interval = (30 * 1.0) / (24.0 * 60.0);
      } else {
         n = previous.n + 1;

         // first interval = 30min
         // second interval = 12h
         // third interval = 24h
         if (n == 1) {
            // in 30m
            interval = (30.0 * 1.0) / (24.0 * 60.0);
         } else if (n == 2) {
            // in 12h
            interval = 0.5;
         } else {
            // in 1d
            interval = 1.0;
         }
      }
      // Add 10% "fuzz" to interval to avoid bunching up reviews
      interval = interval * (1.0 + Math.random() * 0.1);
   } else {
      // Reviewing phase

      if (evaluation.score < 3) {
         // Failed, so force re-review in 30 minutes and reset n count
         n = 0;
         interval = (30 * 1.0) / (24.0 * 60.0);

         // Reduce efactor
         efactor = Math.max(1.3, previous.efactor - 0.2);
      } else {
         // Passed, so adjust efactor and compute interval

         // First see if this was done close to on time or late. We handle early reviews differently
         // because Fresh Cards allows you to review cards as many times as you'd like, outside of
         // the SRS schedule. See details below in the "early" section.

         if (evaluation.lateness >= -0.1) {
            // Review was not too early, so handle normally

            n = previous.n + 1;

            var latenessScoreBonus = 0;
            var intervalAdjustment = 1.0;

            // If this review was done late and user still got it right, give a slight bonus to the score of up to 1.0.
            // This means if a card was hard to remember AND it was late, the efactor should be unchanged. On the other
            // hand, if the card was easy, we should bump up the efactor by even more than normal.
            if (evaluation.lateness >= 0.1 && evaluation.score >= 3.0) {
               // Lateness factor is a function of previous interval length. The longer
               // previous interval, the harder it is to get a lateness bonus.
               // This ranges from 0.0 to 1.0.
               let latenessFactor = Math.min(1.0, evaluation.lateness);

               // Score factor can range from 1.0 to 1.5
               let scoreFactor = 1.0 + (evaluation.score - 3.0) / 4.0;

               // Bonus can range from 0.0 to 1.0.
               latenessScoreBonus = 1.0 * latenessFactor * scoreFactor;
            } else {
               // Card wasn't late, so adjust differently

               if (evaluation.score >= 3.0 && evaluation.score < 4) {
                  // hard card, so adjust interval slightly
                  intervalAdjustment = 0.8;
               }
            }

            let adjustedScore = latenessScoreBonus + evaluation.score;
            efactor = Math.max(
               1.3,
               previous.efactor +
                  (0.1 -
                     (5 - adjustedScore) * (0.08 + (5 - adjustedScore) * 0.02))
            );

            // Figure out interval. First review is in 1d, then 6d, then based on efactor and previous interval.
            if (previous.n == 0) {
               interval = 1;
            } else if (previous.n == 1) {
               interval = 6;
            } else {
               interval = Math.ceil(
                  previous.interval * intervalAdjustment * efactor
               );
            }
         } else {
            // Card was reviewed "too early". Since Fresh Cards lets you review cards outside of the
            // SRS schedule, it takes a different approach to early reviews. It will not progress the SRS
            // schedule too quickly if you review early. If we didn't handle this case, what would happen
            // is if you review a card multiple times in the same day, it would progress the schedule and
            // might make the card due next in 30 days, which doesn't make sense. Just because you reviewed
            // it frequently doesn't mean you have committed to memory stronger. It still takes a few days
            // for it to sink it.

            // Therefore, what this section does is does a weighted average of the previous interval
            // with the interval in the future had you reviewed it on time instead of early. The weighting
            // function gives greater weight to the previous interval period if you review too early,
            // and as we approach the actual due date, we weight the next interval more. This ensures
            // we don't progress through the schedule too quickly if you review a card frequently.

            // Still increment the 'n' value as it really has no effect on 'reviewing stage' cards.
            n = previous.n + 1;

            // Figure out the weight for the previous and next intervals.
            // First, normalize the lateness factor into a range of 0.0 to 1.0 instead of -1.0 to 0.0
            // (which indicates how early the review is).
            const earliness = 1.0 + evaluation.lateness;
            // min(e^(earlieness^2) - 1.0), 1.0) gives us a nice weighted curve. You can plot it on a
            // site like fooplot.com. As we get closer to the true deadline, the future is given more
            // weight.
            const futureWeight = Math.min(
               Math.exp(earliness * earliness) - 1.0,
               1.0
            );
            const currentWeight = 1.0 - futureWeight;

            // Next we take the score at this time and extrapolate what that score may be in the
            // future, using the weighting function. Essentially, if you reviewed 5.0 today, we will
            // decay that score down to a minimum of 3.0 in the future. Something easily remembered
            // now may not be easily remembered in the future.
            const predictedFutureScore =
               currentWeight * evaluation.score + futureWeight * 3.0;

            // Compute the future efactor and interval using the future score
            const futureEfactor = Math.max(
               1.3,
               previous.efactor +
                  (0.1 -
                     (5 - predictedFutureScore) *
                        (0.08 + (5 - predictedFutureScore) * 0.02))
            );
            var futureInterval;

            // Figure out interval. First review is in 1d, then 6d, then based on efactor and previous interval.
            if (previous.n == 0) {
               futureInterval = 1;
            } else if (previous.n == 1) {
               futureInterval = 6;
            } else {
               futureInterval = Math.ceil(previous.interval * futureEfactor);
            }

            // Finally, combine the previous and next efactor and intervals
            efactor =
               previous.efactor * currentWeight + futureEfactor * futureWeight;
            interval =
               previous.interval * currentWeight +
               futureInterval * futureWeight;
         }

         // Add 5% "fuzz" to interval to avoid bunching up reviews
         interval = interval * (1.0 + Math.random() * 0.05);
      }
   }

   return { n, efactor, interval };
};

export const newDue = (baseDue: string, interval: number) => {
   return dayjs(baseDue || new Date()).add(interval, 'day');
};

export default srsFunc;
