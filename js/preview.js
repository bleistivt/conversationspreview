/*global gdn, jQuery*/

jQuery(($) => {
    const $preview = $('<div class="Preview"></div>')
        .insertBefore('#ConversationForm .bodybox-wrap, #Form_ConversationMessage .bodybox-wrap')
        .hide();

    const $textbox = $('#ConversationForm textarea[name="Body"], #Form_ConversationMessage textarea[name="Body"]');

    $('<a class="Button PreviewButton">' + gdn.getMeta('conversationsPreview.preview') + '</a>')
        .insertBefore('#ConversationForm input[type="submit"], #Form_ConversationMessage input[type="submit"]')
        .click(({target}) => {
            const $this = $(target);

            if ($this.hasClass('WriteButton')) {
                $preview.hide();
                $textbox.show();

                $this
                    .addClass('PreviewButton')
                    .removeClass('WriteButton')
                    .text(gdn.getMeta('conversationsPreview.preview'));

                return;
            }

            gdn.disable($this);

            $this.toggleClass('PreviewButton').toggleClass('WriteButton');

            $.post(
                gdn.url('messages/preview'),
                {
                    Body: $this.closest('form').find('textarea[name="Body"]').val(),
                    Format: $this.closest('form').find('input[name="Format"]').val(),
                    TransientKey: gdn.definition('TransientKey')
                },
                (data) => {
                    $preview.html(data).show();
                    $textbox.hide();

                    $this
                        .addClass('WriteButton')
                        .removeClass('PreviewButton')
                        .text(gdn.getMeta('conversationsPreview.edit'));

                    $(document).trigger('PreviewLoaded');
                },
                'html'
            ).always(() => {
                gdn.enable($this);
            });
        });

    $(document).on('MessageAdded', () => {
        $('.WriteButton').click();
    });
});
