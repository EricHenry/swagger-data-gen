/**
 * 
 */
function configure(values, config, core) {
   const newValues = [];
  // if all is true assume that none of core were in the
  // passed values array and check if there are any missing
  // then add them in if they are
  if (config.all === true) {
    const missing = difference(core, values);
    newValues.concat(missing, values);
    return newValues;
  }

  if (config.all === false) {
    const removedCoreValues = difference(values, core);
    return removedCoreValues;
  } 

  newValues = [...values];
  Object.keys(config)
    .filter(k => k === 'all') // assume that the 'all' property is passed in as undefined
    .forEach(k => {
      if (k === true) {
        if (newValues.includes(generators[k])) {
          return;
        }

        newValues.push(generators[k]);
      }

      if (k === false) {
        if (!newValues.includes(generators[k])) {
          return;
        }

        var listLocation = newValues.findIndex(generators[k]);
        newValues.splice(listLocation, 1);
      }
    });

  return newValues;
}

module.exports = configure;
