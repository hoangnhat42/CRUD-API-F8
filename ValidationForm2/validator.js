const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class Validator {
  constructor(formSelector) {
    this.formElement = $(formSelector);
    this.formRules = {};
    this.formValid = true;
    this.validationRules = {
      required(value) {
        return value ? undefined : "Vui lòng nhập vào trường này";
      },
      email(value) {
        const regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value) ? undefined : "Vui lòng nhập email hợp lệ";
      },
      min(min) {
        return function (value) {
          return value.length >= min
            ? undefined
            : `Vui lòng nhập tối thiểu ${min} kí tự`;
        };
      },
      confirm(value) {
        return value ===
          this.formElement.querySelector("#password-confirmation").value
          ? undefined
          : "Mật khẩu nhập lại chưa chính xác";
      },
    };

    this.inputs = [...this.formElement.querySelectorAll("[name][rules]")];
    for (this.input of this.inputs) {
      this.rules = this.input.getAttribute("rules").split("|");

      for (this.rule of this.rules) {
        if (this.formRules) {
          this.isRuleHasValue = this.rule.includes(":");
          this.inputRule = this.validationRules[this.rule];
          if (this.isRuleHasValue) {
            this.ruleInfo = this.rule.split(":");
            this.inputRule = this.validationRules[this.ruleInfo[0]](
              this.ruleInfo[1]
            );
          }

          if (!Array.isArray(this.formRules[this.input.name])) {
            this.formRules[this.input.name] = [];
          }
          this.formRules[this.input.name].push(this.inputRule);
        }
      }

      switch (this.input.type) {
        case "file":
          this.input.onchange = this.handleInputFile;
          this.input.oninput = this.handleClearInvalid;
          break;
        default:
          this.input.onblur = this.handleValidate;
          this.input.oninput = this.handleClearInvalid;
          break;
      }
    }

    this.formElement.onsubmit = this.handleOnSubmit;
  }

  handleValidate = (e) => {
    this.formParent = e.target.closest(".form-group");
    this.errorElement = this.formParent.querySelector(".form-message");
    this.errorMessage;

    this.rules = this.formRules[e.target.name];

    for (this.rule of this.rules) {
      switch (e.target.type) {
        case "checkbox":
        case "radio":
          this.errorMessage = this.rule(
            this.formElement.querySelector('input[name = "gender"]:checked')
          );
          break;
        default:
          this.errorMessage = this.rule(e.target.value);
          break;
      }
      if (this.errorMessage) break;
    }

    if (this.errorMessage) {
      this.formParent.classList.add("invalid");
      this.errorElement.innerText = this.errorMessage;
    } else {
      this.formParent.classList.remove("invalid");
      this.errorElement.innerText = "";
    }

    return !!this.errorMessage;
  };

  handleClearInvalid = (e) => {
    this.formParent = e.target.closest(".form-group");
    this.errorElement = this.formParent.querySelector(".form-message");
    this.formParent.classList.remove("invalid");
    this.errorElement.innerText = "";
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    for (this.input of this.inputs) {
      this.isInValid = this.handleValidate({ target: this.input });
      if (this.isInValid) {
        this.formValid = false;
      }
    }
    if (this.formValid) {
      this.formValues = this.inputs.reduce((objValues, input) => {
        switch (input.type) {
          case "checkbox":
            if (input.checked) {
              if (!Array.isArray(objValues[input.name])) {
                objValues[input.name] = [];
              }
              objValues[input.name].push(input.value);
            }
            break;
          case "radio":
            if (input.checked) {
              objValues[input.name] = input.value;
            }
            break;

          case "file":
            objValues[input.name] = input.files;
            break;
          default:
            objValues[input.name] = input.value;
            break;
        }
        return objValues;
      }, {});

      if (this.onSubmit) {
        this.onSubmit(this.formValues);
      } else {
        this.formElement.submit();
      }
    }
  };

  handleInputFile = (e) => {
    this.formParent = e.target.closest(".form-group");
    this.iconUpload = this.formParent.querySelector(".icon-upload");
    // this.iconUpload.style.color = "#01877E";
  };
}
