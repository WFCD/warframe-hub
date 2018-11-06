<template>
<div class="modal fade" id="sound-options" tabindex="-1" role="dialog" aria-labelledby="soundOptionLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button name="Dismiss Modal" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="modal-title">Sound Options</h4>
      </div>
      <div class="modal-body">
        Checking the checkbox next to an option will allow a sound to be played for those new items.
        <ul>
          <li class="text-left" id="option_sound_cetus_night">
            <div class="checkbox">
              <input type="checkbox" id="sound_cetus_night_checkbox" class="sound-option-check" data-sound="sound_cetus_night">
              <label for="sound_cetus_night_checkbox">Eidolon Roar to Start the Night</label>
            </div>
          </li>
          <li class="text-left" id="option_sound_alert">
            <div class="checkbox">
              <input type="checkbox" id="sound_alert_checkbox" class="sound-option-check" data-sound="sound_alert">
              <label for="sound_alert_checkbox">Alert Tone</label>
            </div>
          </li>
          <li class="text-left" id="option_sound_invasion">
            <div class="checkbox">
              <input type="checkbox" id="sound_invasion_checkbox" class="sound-option-check" data-sound="sound_invasion">
              <label for="sound_invasion_checkbox">Invasion Tone</label>
            </div>
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button name="Dismiss Modal" type="button" class="btn btn-secondary" data-dismiss="modal" style="cursor:pointer;">Close</button>
      </div>
    </div>
  </div>
</div>
</template>
