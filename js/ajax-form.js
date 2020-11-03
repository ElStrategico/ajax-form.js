/**
 * form.js
 *
 * Micro library for work with ajax forms
 *
 * Example:
 *      ```html
 *      <form method="POST" action="/handler" class="form">
 *          <input type="text" name="login" placeholder="Login">
 *          <input type="password" name="password" placeholder="Password">
 *          <input type="checkbox" name="accept_rules" value="1">
 *          <button>Login</button>
 *      </form>
 *      ```html
 *      ```js
 *      FormInit({
 *          selector: '.form',
 *          submit: (formData) => {
 *              console.log(formData)
 *          }
 *          success: (response) => {
 *              console.log(response);
 *          },
 *          error: (response) => {
 *              console.log(response);
 *          }
 *      });
 *      ```js
 *
 * GitHub - https://github.com/ElStrategico/form.js
 */

/**
 * @return {Object}
 */
const DefaultSettings = () => {
    return {
        selector: 'form',
        proccessData: false,
        contentType: false,
        submit: formData => {},
        sent: response => {},
        success: response => {},
        error: response => {},
        async: false
    };
};

/**
 * @param {object} settings
 */
const FormInit = (settings = {}) => {
    let defaultSettings = DefaultSettings();

    for (let key in defaultSettings) {
        if (settings[key] == undefined) {
            settings[key] = defaultSettings[key];
        }
    }

    let formElement = $(settings.selector);
    let formData = {
        _token: $('meta[name="csrf-token"]').attr('content')
    };
    let inputs = $('form').find('[name]');

    for (let i = 0; i < inputs.length; i++) {
        let input = $(inputs.get(i));
        formData[input.attr('name')] = input.val();
    }

    settings.method = settings.method != undefined ? settings.method : formElement.attr('method');
    settings.action = settings.action != undefined ? settings.action : formElement.attr('action');

    formElement.submit((event) => {
        event.preventDefault();

        settings.submit(formData);

        $.ajax({
            type: settings.method,
            url: settings.action,
            proccessData: settings.proccessData,
            contentType: settings.contentType,
            data: formData,
            success: response => {
                settings.sent(response);
                settings.success(response)
            },
            error: response => {
                settings.sent(response);
                settings.error(response)
            },
            async: settings.async
        });
    });
};