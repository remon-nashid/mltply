// @flow

import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Button, Text, Icon, View, H3 } from 'native-base'
import ScreenTemplate from '../ScreenTemplate'
import { HR } from '../misc'
import config from '../../config'

const Header = ({ children }) => (
  <H3 style={{ marginBottom: 10 }}>{children}</H3>
)

const Link = ({
  label,
  url,
  iconName
}: {
  label: string,
  url: string,
  iconName?: string
}) => (
  <TouchableOpacity
    key={label}
    accessibilityRole="link"
    target="_blank"
    href={url}
    style={{ margin: 5 }}
  >
    <Button bordered>
      <Text>{label}</Text>
      <Icon
        type="MaterialCommunityIcons"
        name={iconName || label}
        style={{ marginLeft: 0 }}
      />
    </Button>
  </TouchableOpacity>
)

const SocialLinks = () => {
  return (
    <View>
      <Header>Where to find us</Header>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {config.socialLinks.map(
          ({
            label,
            iconName,
            url
          }: {
            label: string,
            iconName?: string,
            url: string
          }) => <Link key={label} label={label} url={url} iconName={iconName} />
        )}
      </View>
    </View>
  )
}

const FeatureRequests = () => (
  <View>
    <Header>Vote for next feature</Header>
    <Link
      label={'Feature requests'}
      url={config.canny}
      iconName={'source-pull'}
    />
  </View>
)

const Disclaimer = () => (
  <View>
    <Header>Disclaimer</Header>
    <Text>
      The information contained on mltpl.ly (the "Service") is for general
      information purposes only. mltp.ly assumes no responsibility for errors or
      omissions in the contents on the Service.{'\n\n'}
      In no event shall mltp.ly be liable for any special, direct, indirect,
      consequential, or incidental damages or any damages whatsoever, whether in
      an action of contract, negligence or other tort, arising out of or in
      connection with the use of the Service or the contents of the Service.
      mltp.ly reserves the right to make additions, deletions, or modification
      to contents and/or features on the Service at any time without prior
      notice.
    </Text>
  </View>
)

export default class AboutScreen extends React.PureComponent<any> {
  render() {
    return (
      <ScreenTemplate>
        <SocialLinks />
        <HR />
        <FeatureRequests />
        <HR />
        <Disclaimer />
      </ScreenTemplate>
    )
  }
}
