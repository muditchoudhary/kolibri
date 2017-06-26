/* eslint-env mocha */
// The following two rules are disabled so that we can use anonymous functions with mocha
// This allows the test instance to be properly referenced with `this`
/* eslint prefer-arrow-callback: "off", func-names: "off" */

import Vue from 'vue-test';
import Vuex from 'vuex';
import assessmentWrapper from '../../src/views/assessment-wrapper';

import assert from 'assert';

const createComponent = (totalattempts, pastattempts, masteryModel) => {
  const propsData = {
    id: 'test',
    kind: 'test',
  };
  const store = new Vuex.Store({
    state: {
      core: {
        logging: {
          mastery: {
            totalattempts,
            pastattempts,
          },
        },
        session: {
          user_id: 'test',
        },
      },
      pageState: {
        content: {
          assessmentIds: [],
          masteryModel: masteryModel || {},
          randomize: false,
        },
      },
    },
  });
  const Component = Vue.extend(assessmentWrapper);
  return new Component({ propsData, store });
};

describe('assessmentWrapper Component', function () {
  beforeEach(function () {
    this.kind = 'test';
    this.files = [
      {
        available: true,
        extension: 'tst',
      },
    ];
    this.id = 'testing';
  });
  describe('computed property', function () {
    describe('exerciseProgress', function () {
      it('should be 0 when there are no past attempts', function () {
        this.vm = createComponent([], 0);
        assert.equal(this.vm.exerciseProgress, 0);
      });
      let numCorrect;
      let m;
      let n;
      let totalattempts;
      for (n = 1; n < 6; n += 1) {
        for (m = 1; m <= n; m += 1) {
          for (totalattempts = 0; totalattempts <= n + 1; totalattempts += 1) {
            for (numCorrect = 0; numCorrect <= m; numCorrect += 1) {
              /* eslint-disable no-loop-func */
              it(`should be ${numCorrect / m} when there are ${totalattempts} past attempts, masteryModel is ${m} of ${n} and there are ${numCorrect} correct in the window`, function () {
                const masteryModel = {
                  type: 'm_of_n',
                  m,
                  n,
                };
                const pastattempts = Array(m - numCorrect).fill({ correct: 0 }).concat(
                  Array(numCorrect).fill({ correct: 1 })).concat(
                  Array(totalattempts - m).fill({ correct: 0 }));
                this.vm = createComponent(totalattempts, pastattempts, masteryModel);
                assert.equal(this.vm.exerciseProgress, numCorrect / m);
              });
              /* eslint-enable no-loop-func */
            }
          }
        }
      }
    });
  });
});
