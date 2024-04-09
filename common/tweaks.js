export { TweakConfig, Tweaks };

class TweakConfig {
  constructor (inputType = 'float', onChange = null) {
    this.inputType = inputType;
    this.onChange = onChange;
  }
}

class Tweaks {
  constructor (tweakConfigs = {}, onChangeAny = null) {
    for (let key in tweakConfigs) {
      let tweakConfig = tweakConfigs[key];

      let inputElem = document.getElementById(key);

      let onChangeWrapper = (isInit) => {
        if (tweakConfig.inputType == 'float') {
          this[key] = parseFloat(inputElem.value);
        } else if (tweakConfig.inputType == 'int') {
          this[key] = parseInt(inputElem.value);
        } else {
          this[key] = inputElem.value;
        }
        if (tweakConfig.onChange) {
          tweakConfig.onChange(this, isInit);
        }
        if (!isInit && onChangeAny) {
          onChangeAny();
        }
      };
      onChangeWrapper(true);
      inputElem.addEventListener('input', e => onChangeWrapper(false));
    }
  }
};