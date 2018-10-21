export default class Modal {
    constructor (modalSelector, openSelector, closeSelector) {
        this.$modal = $(modalSelector);
        this.$open = $(openSelector);
        this.closeSelector = closeSelector;

        this.apply();
    }

    apply () {
        this.$modal.iziModal();

        this.$open.click((e) => {
            e.preventDefault();
            if (e && e.currentTarget) {
                const
                    $modal = $(e.currentTarget.hash),
                    $modalClose = $modal.find(this.closeSelector);
                if ($modal.length) {
                    $modal.iziModal('open');
                    $modalClose.click((e) => {
                        e.preventDefault();
                        $modal.iziModal('close');
                    });
                }
            }
        });
    }
}
