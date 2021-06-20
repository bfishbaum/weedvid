import { call, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';

// cancels any Saga after milliseconds, dispatching failureAction
export function* timeoutCall(effect, milliseconds, failureAction={ type: '' }) {
    function* timeoutGenerator(){
        yield delay(milliseconds);
        yield put(failureAction);
    }

    const { effectResult, timeoutResult } = yield race(
        {
            effectResult: effect,
            timeoutResult: call(timeoutGenerator)
        }
    );
    if (effectResult) {
        return effectResult;
    } else {
        return null;
    }
}
