import Modal from './utils/Modal';
import Form from './utils/Form';

(($) => {
    $('.slider1_container').each((index, element) => {
        const sliderId = 'slider1_container' + index;
        $(element).attr('id', sliderId);
        new $JssorSlider$(sliderId, {
            $AutoPlay: true
        });
    });

    new Modal('.modal', '.button_modal-open', '.modal__close');

    $('.form').each((idx, elem) => {
       new Form(elem).init();
    });

    $('.form__input[data-mask="tel"]').each((idex, element) => {
        new Cleave(element, {
            phone: true,
            phoneRegionCode: 'RU'
        });
    });
})(jQuery);
