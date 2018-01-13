/* globals $, COMPONENTS, updateGrid, cloneTemplate, cloneTimer */

const fissureGlyphs = ['https://i.imgur.com/D595KoY.png', 'https://i.imgur.com/VpBDaZV.png', 'https://i.imgur.com/YOjBckN.png', 'https://i.imgur.com/nZ3FfpC.png'];

COMPONENTS.fissures = {
  id: 'fissures',
  worldStateKey: 'fissures',
  parse(data) {
    let numFissures = 0;

    data.sort((a, b) => {
      const tierA = a.tierNum;
      const tierB = b.tierNum;
      if (tierA < tierB) { return -1; }
      if (tierA > tierB) { return 1; }
      return 0;
    });

    data.forEach(fissure => {
      if (!fissure.expired) {
        numFissures += 1;
        if ($(`#${fissure.id}`).length === 0) {
          this.add(fissure);
        }
      }
      // if it's expired we don't care, timer will delete this (this.expired)
    });

    if (numFissures > 0) {
      $('#fissuretitle').hide();
    } else {
      $('#fissuretitle').html('No active Void Fissures :(').show();
    }
  },
  add(fissure) {
    const fissureElement = cloneTemplate(this.id);
    fissureElement.attr('id', fissure.id);

    fissureElement.find('img')
      .attr('title', `Tier ${fissure.tierNum} Fissure`)
      .attr('src', `${fissureGlyphs[fissure.tierNum - 1]}`);

    fissureElement.find('.node').html(fissure.node);
    fissureElement.find('.mission-type').html(fissure.missionType);
    fissureElement.find('.tier').html(fissure.tier);

    cloneTimer(fissure.activation, fissure.expiry, this.id)
      .appendTo(fissureElement);

    $('#fissurebody').before(fissureElement);
  },
  expired(timer) {
    timer.closest('li').remove();
    updateGrid();
  },
  cleanup() {
    $('#fissureList').children().not('#fissurebody').remove();
  },
};
