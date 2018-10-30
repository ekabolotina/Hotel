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

    const modalBook = new Modal(
        '.modal-book',
        '.button_modal-open',
        '.modal__close'
    ).init();

    new Form('.modal-book__form', () => {
        modalBook.close();
    }).init();
})(jQuery);
