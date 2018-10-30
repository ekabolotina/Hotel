import Validate from "./Validate";

export default class Form {
    constructor (selector, onSuccess = () => {}) {
        this.inputErrorClass = 'form__input_error';
        this.submitLoadingClass = 'button_loading';

        this.submitSelector = '.form__submit';
        this.inputSelector = '.form__input';

        this.notificationStatusClasses = {
            success: 'form__notification_success',
            fail: 'form__notification_fail'
        };

        this.selector = selector;
        this.onSuccess = onSuccess;
    }

    init () {
        this.$form = $(this.selector);
        this.$submit = this.$form.find(this.submitSelector);
        this.$input = this.$form.find(this.inputSelector);
        this.url = this.$form.attr('action');

        this.$input.filter('[type="tel"]').intlTelInput({
            onlyCountries: ['ru', 'am', 'az', 'by', 'ge', 'kg', 'lv', 'lt', 'md', 'tj', 'tm', 'ua', 'uz', 'ee'],
            preferredCountries: ['ru'],
            nationalMode: false,
            separateDialCode: true,
            hiddenInput: 'phone-with-code'
        }).on('countrychange', (e) => {
            this.setInputMaskByPlaceholder(e.currentTarget);
            e.currentTarget.value = '';
        });

        this.$form.on('submit', (e) => {
            e.preventDefault();
            this.sendForm();
        });

        this.$input.on('focus', (e) => {
            this.removeInputError(e.currentTarget);
        });

        this.$input.each((idx, el) => {
            if (el.dataset['validationType']) {
                const validate = new Validate(el, el.dataset['validationType']).init();
                $(el).data('validate', validate);
            }
            if (el.type === 'tel') {
                this.setInputMaskByPlaceholder(el);
            }
        });

        return this;
    }

    checkFields () {
        let results = true;

        this.$input.filter('[data-required="true"]').each((idx, elem) => {
            const $elem = $(elem);

            if (
                $elem.val() === '' ||
                ($elem.data('validate') && !$elem.data('validate').isValid()) ||
                ($elem.inputmask('getmetadata') && !$elem.inputmask('isComplete'))
            ) {
                this.addInputError(elem);
                results = false;
            } else {
                this.removeInputError(elem);
            }
        });

        return results;
    }

    showNotification (type = 'success', text = '', delay = 3000) {
        let
            notificationStatusClass = type === 'success' ? this.notificationStatusClasses.success : this.notificationStatusClasses.fail,
            $notification = this.getNotificationMarkup(notificationStatusClass, text).hide();

        this.$submit.after($notification);
        $notification.show(300);
        setTimeout(() => {
            $notification
                .hide(200)
                .remove();
        }, delay);
    }

    getNotificationMarkup (statusClass, text) {
        return $(`
            <div class="form__notification ${ statusClass }">${ text }</div>
        `);
    }

    addInputError(input) {
        $(input).addClass(this.inputErrorClass);
    }

    removeInputError(input) {
        $(input).removeClass(this.inputErrorClass);
    }

    addLoading () {
        this.$submit
            .addClass(this.submitLoadingClass)
            .attr('disabled', 'disabled');
    }

    removeLoading () {
        this.$submit
            .removeClass(this.submitLoadingClass)
            .removeAttr('disabled');
    }

    sendForm () {
        if (!this.checkFields() || this.$submit.hasClass(this.submitLoadingClass)) {
            return;
        }

        this.addLoading();

        $.post(this.url, this.$form.serialize())
            .done((data) => {
                if (data) {
                    data = JSON.parse(data);
                }
                if (data.error === 200) {
                    this.showNotification('success', 'Ваша заявка прината. Спасибо!');
                    this.$form.trigger('reset');
                    setTimeout(() => {
                        this.onSuccess();
                    }, 3000);
                } else {
                    this.showNotification('fail', 'К сожалению, произошла ошибка.');
                }
            })
            .fail(() => {
                this.showNotification('fail', 'К сожалению, произошла ошибка.');
            })
            .always(() => {
                setTimeout(() => {
                    this.removeLoading();
                }, 3000);
            });
    }

    setInputMaskByPlaceholder(input) {
        $(input).inputmask(input.placeholder.replace(/\d/g, '9'));
    }
}
