export { TweakConfig, Tweaks, OnTweakPanelSelected };

class TweakConfig {
  constructor (inputType = 'float', onChange = null) {
    this.inputType = inputType;
    this.onChange = onChange;
  }
}

class Tweaks {
  constructor (tweakConfigs = {}, onChangeAny = null) {
    let urlSearchParams = new URLSearchParams(window.location.search);

    for (let key in tweakConfigs) {
      let tweakConfig = tweakConfigs[key];

      let inputElem = document.getElementById(key);

      let onChangeWrapper = (isInit) => {
        let param = urlSearchParams.get(key);
        console.log("key: " + key + " = " + param);
        let readFromParam = isInit && param !== null;

        if (tweakConfig.inputType == 'float') {
          if (readFromParam) {
            this[key] = parseFloat(param);
            inputElem.value = param;
          } else {
            this[key] = parseFloat(inputElem.value);
            urlSearchParams.set(key, this[key].toFixed(3));
          }
        } else if (tweakConfig.inputType == 'int') {
          if (readFromParam) {
            this[key] = parseInt(param);
            inputElem.value = param;
          } else {
            this[key] = parseInt(inputElem.value);
            urlSearchParams.set(key, this[key].toString());
          }
        } else if (tweakConfig.inputType == 'select') {
          let paramInvalid = true;
          let options = inputElem.options;
          if (readFromParam) {
            for (let optIdx = 0; optIdx < options.length; optIdx++) {
              if (options[optIdx].value === param) {
                inputElem.selectedIndex = optIdx;
                this[key] = param;
                paramInvalid = false;
                break;
              }
            }
          }
          if (paramInvalid || !readFromParam) {
            this[key] = options[inputElem.selectedIndex].value;
            urlSearchParams.set(key, this[key]);
          }
        } else {
          if (readFromParam) {
            this[key] = param;
            inputElem.value = param;
          } else {
            this[key] = inputElem.value;
            urlSearchParams.set(key, this[key]);
          }
        }
        if (tweakConfig.onChange) {
          tweakConfig.onChange(this, isInit);
        }
        if (!isInit && onChangeAny) {
          onChangeAny();
        }
        if (!isInit) {
          window.history.pushState({}, "", `?${urlSearchParams.toString()}`);
        }
      };
      onChangeWrapper(true);
      inputElem.addEventListener('input', e => onChangeWrapper(false));

      // Make sure the search parameters are updated after going through and
      // getting all the default values.
      window.history.pushState({}, "", `?${urlSearchParams.toString()}`);
    }
  }
};

// Utility function for hiding all divs with class "tweak-panel" except for the
// one with the given name.
function OnTweakPanelSelected(panelId) {
  let panels = document.getElementsByClassName("tweak-panel");
  for (let i = 0; i < panels.length; i++) {
    if (panels[i].id === panelId) {
      panels[i].style.removeProperty('display');
    } else {
      panels[i].style.display = "none";
    }
  }
}
