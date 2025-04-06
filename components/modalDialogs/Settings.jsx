import NotifFilters from '@/components/modalDialogs/Filters/NotificationFilters.jsx';
import FissureFilters from '@/components/modalDialogs/Filters/FissureFilters.jsx';
import SoundFilters from '@/components/modalDialogs/Filters/SoundFilters.jsx';
import PlatformsDialog from '@/components/modalDialogs/Filters/PlatformsDialog.jsx';
import Languages from '@/components/modalDialogs/Filters/Languages.jsx';
import ThemeFilter from '@/components/modalDialogs/Filters/ThemeFilter';
import ComponentsFilter from '@/components/modalDialogs/Filters/ComponentsFilter';
import { useWorldstateStore } from '~/store/worldstate';

export default {
  name: 'SettingsModal',
  methods: {
    checkNotifications() {
      return useWorldstateStore().checkNotifPermissions();
    },
  },
  render() {
    return (
      <b-modal
        id="settings-modal"
        class="settings-modal"
        centered
        size="xl"
        title="Settings"
        shown={this.checkNotifications}
      >
        <b-tabs card vertical>
          <PlatformsDialog />
          <Languages />
          <ComponentsFilter />
          <ThemeFilter />
          <NotifFilters />
          <FissureFilters />
          <SoundFilters />
        </b-tabs>
      </b-modal>
    );
  },
};
