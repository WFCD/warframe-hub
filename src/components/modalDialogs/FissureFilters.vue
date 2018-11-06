<template>
  <div class="modal fade" id="fissure-filters" tabindex="-1" role="dialog" aria-labelledby="fissureFilterLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button name="Dismiss Modal" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">Fissures Planets Filters</h4>
        </div>
        <div class="modal-body">
          Checking the checkbox next to a planet below will disable it from being shown in the fissures list.
          <ul>
            {{#each planets}}
            <li class="text-left" id="fissure_option_{{@key}}">
              <div class="checkbox">
                <input type="checkbox" id="{{@key}}_fissure_checkbox" class="fissure-filter-check" data-fissure="{{@key}}">
                <label for="{{@key}}_fissure_checkbox">{{this}}</label>
              </div>
            </li>
            {{/each}}
          </ul>
        </div>
        <div class="modal-footer">
          <button name="Dismiss Modal" type="button" class="btn btn-secondary" data-dismiss="modal" style="cursor:pointer;">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
