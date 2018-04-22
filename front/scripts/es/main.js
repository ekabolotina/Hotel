(($) => {

    $(document).ready(() => {

        $('.slider1_container').each((index, element) => {
            const sliderId = 'slider1_container' + index;
            $(element).attr('id', sliderId);
            new $JssorSlider$(sliderId, {
                $AutoPlay: true
            });
        })

    });

})(jQuery);
