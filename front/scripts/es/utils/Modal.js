export default class Modal {
    constructor (modalSelector, openSelector, closeSelector) {
        this.modalSelector = modalSelector;
        this.openSelector = openSelector;
        this.closeSelector = closeSelector;
    }

    init () {
        this.$open = $(this.openSelector);
        this.$modal = $(this.modalSelector);

        this.$modal.iziModal({
            bodyOverflow: true
        });

        this.applyEvents();

        return this;
    }

    applyEvents() {
        this.$open.on('click', (e) => {
            e.preventDefault();

            if (e && e.currentTarget) {
                const $modal = $(e.currentTarget.hash);

                if ($modal.length) {
                    this.open($modal);
                }
            }
        });

        this.$modal.on('click', this.closeSelector, (e) => {
            e.preventDefault();
            this.close();
        });
    }

    open($modal = this.$modal) {
        $modal.iziModal('open');
    }

    close($modal = this.$modal) {
        $modal.iziModal('close');
    }
}
