import Modal from './utils/modal';
import Form from './utils/form';

(($) => {

    $(document).ready(() => {

        $('.slider1_container').each((index, element) => {
            const sliderId = 'slider1_container' + index;
            $(element).attr('id', sliderId);
            new $JssorSlider$(sliderId, {
                $AutoPlay: true
            });
        });

        new Modal('.modal', '.button_modal-open', '.modal__close');

        $('.form').each((idx, elem) => {
           new Form(elem);
        });

        $('.form__input_mask_tel').each((idex, element) => {
            new Cleave(element, {
                phone: true,
                phoneRegionCode: 'RU'
            });
        });
    });

})(jQuery);
