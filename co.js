const co = gen => {
  return new Promise((resolve, reject) => {
    const onFulfilled = result => {
      try {
        return run(gen.next(result))
      } catch (e) {
        reject('400')
      }
    }

    const onError = error => {
      try {
        return run(gen.throw(error))
      } catch (e) {
        reject('400')
      }
    }

    const run = yielded => {
      if (yielded.done) return resolve(yielded.value)
      return yielded.value.then(onFulfilled).catch(onError)
    }

    run(gen.next())
  })
}

// Example

const getName = id => new Promise(resolve => {
  if (id === 1) return resolve('Bruno')
  else return resolve('unknown')
})

const getScore = name => {
  if (name === 'Bruno') return Promise.resolve(12)
  else return Promise.reject('Error')
}

const gen = function* (id) {
  const name = yield getName(id)
  try {
    const score = yield getScore(name);
    return `${name}: ${score}`
  } catch (e) {
    return `No score for ${name}`
  }
}

co(gen(1)).then(value => console.log(value)); // Bruno: 12
co(gen(2)).then(value => console.log(value)); // No score for unknown
