export default class Form {
    constructor (selector) {
        this.inputErrorClass = 'form__input_error';
        this.submitSelector = '.form__submit';
        this.submitLoadingClass = 'button_loading';
        this.notificationStatusClasses = {
            success: 'form__notification_success',
            fail: 'form__notification_fail'
        };

        this.$form = $(selector);
        this.$submit = this.$form.find(this.submitSelector);
        this.url = this.$form.attr('action');

        this.apply();
    }

    apply () {
        this.$form.submit((e) => {
            e.preventDefault();
            this.sendForm();
        });
    }

    checkPhoneField (value) {
        const check =  
            /^\d{3} \d{3} \d{2} \d{2}$/.test(value) ||
            /^\d{3} \d{2} \d{2}$/.test(value) ||
            /^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(value) ||
            /^8 \d{3} \d{3} \d{2} \d{2}$/.test(value);
        return check;
    }

    checkFields () {
        let results = true;
        this.$form.find('input:not([type=submit])')
            .removeClass(this.inputErrorClass)
            .each((idx, elem) => {
                const $elem = $(elem);
                if ($elem.val() === '' || ($elem.data('mask') === 'tel' && !this.checkPhoneField($elem.val()))) {
                    results = false;
                    $elem.addClass(this.inputErrorClass);
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
