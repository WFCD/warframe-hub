import './DropdownNavItem.less';

export default {
  name: 'DropdownItem',
  props: {
    isLocal: {
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      default: '#',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'fas fa-external-link-alt',
    },
    labelIfMobile: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return (
      <span>
        {this.isLocal && !this.labelIfMobile && !this.$device.isMobileOrTablet && (
          <b-dd-item to={this.target} exact>
            <i class={`${this.icon} faIcon`}></i>
            {this.label}
          </b-dd-item>
        )}
        {this.isLocal && !this.labelIfMobile && this.$device.isMobileOrTablet && (
          <b-dd-item to={this.target} exact>
            <i class={`${this.icon} faIcon`}></i>
            {this.label}
          </b-dd-item>
        )}
        {this.isLocal && this.labelIfMobile && !this.$device.isMobileOrTablet && (
          <b-dd-item to={this.target} exact>
            <i class={`${this.icon} faIcon`}></i>
            {this.label}
          </b-dd-item>
        )}
        {!this.isLocal && (
          <b-dd-item
            href={this.target}
            rel="noopener"
            target="_blank"
            title={this.labelIfMobile && !this.$device.isMobileOrTablet ? this.label : ''}
          >
            <i class={`${this.icon} faIcon`}></i>
            {this.labelIfMobile ? (this.$device.isMobileOrTablet ? this.label : '') : this.label}
          </b-dd-item>
        )}
      </span>
    );
  },
};
