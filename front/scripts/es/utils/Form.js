import Validate from "./Validate";

export default class Form {
    constructor (selector) {
        this.inputErrorClass = 'form__input_error';
        this.submitLoadingClass = 'button_loading';

        this.submitSelector = '.form__submit';
        this.inputSelector = '.form__input';

        this.notificationStatusClasses = {
            success: 'form__notification_success',
            fail: 'form__notification_fail'
        };
        this.selector = selector;
    }

    init () {
        this.$form = $(this.selector);
        this.$submit = this.$form.find(this.submitSelector);
        this.$input = this.$form.find(this.inputSelector);
        this.url = this.$form.attr('action');

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
        });

        return this;
    }

    checkFields () {
        let results = true;

        this.$input.filter('[data-required="true"]').each((idx, elem) => {
            const $elem = $(elem);

            if (
                $elem.val() === '' ||
                ($elem.data('validate') && !$elem.data('validate').isValid())
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
}
