<?php

class ConversationsPreviewPlugin extends Gdn_Plugin {

    public function messagesController_render_before($sender) {
        $sender->addJsFile('preview.js', 'plugins/conversationspreview');
        $sender->addDefinition('conversationsPreview.preview', Gdn::translate('Preview'));
        $sender->addDefinition('conversationsPreview.edit', Gdn::translate('Edit'));
    }

    public function messagesController_preview_create($sender) {
        $sender->permission('Conversations.Conversations.Add');

        $request = Gdn::request();

        if (!$request->isAuthenticatedPostBack()) {
            throw permissionException('Javascript');
        }

        $sender->EventArguments['MessageBody'] = $request->post('Body');

        $sender->fireEvent('BeforeMessagePreviewFormat');

        echo '<div class="Message">'.Gdn_Format::to(
            $sender->EventArguments['MessageBody'],
            $request->post('Format', Gdn::config('Garden.InputFormatter'))
        ).'</div>';

        $sender->fireEvent('AfterMessagePreviewFormat');
    }

}
