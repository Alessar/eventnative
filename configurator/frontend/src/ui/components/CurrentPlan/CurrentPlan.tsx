import { useState } from 'react';
import { Button, Input, Modal, Progress } from 'antd';
import cn from 'classnames';
import { PaymentPlan, paymentPlans } from '@service/billing';
import { useServices } from '@hooks/useServices';
import { handleError } from '@./lib/components/components';
import styles from './CurrentPlan.module.less';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export type CurrentPlanProps = {
  planTitle: string,
  planId: string
  usage: number
  limit: number
  onPlanChangeModalOpen: () => void,
}

export const CurrentPlan: React.FC<CurrentPlanProps> = (props) => {
  const [upgradeDialogVisible, setUpgradeDialogVisible] = useState(false);
  const services = useServices();
  const usagaPct = props.usage/props.limit*100;
  return <><div>
    <div>You're on <b className="capitalize">{props.planTitle}</b> plan</div>
    <div>
      <div><Progress percent={usagaPct} showInfo={false} status={usagaPct >= 100 ? 'exception' : 'active'} /></div>
      <div className="text-xs">
        <span className="text-secondaryText">Used:  <b>{numberWithCommas(props.usage)} / {numberWithCommas(props.limit)}</b></span>
      </div>
    </div>
    <div className="text-center mt-2"><a href="https://jitsu.com/pricing">Pricing Info</a> • <a onClick={() => {
      props.onPlanChangeModalOpen();
      services.analyticsService.track('upgrade_plan_requested');
      setUpgradeDialogVisible(true)
    }}>Upgrade</a></div>
  </div>
  <PlanUpgradeDialog visible={upgradeDialogVisible} hide={() => setUpgradeDialogVisible(false)} currentPlanId={props.planId} />
  </>
}

export const PlanUpgradeDialog: React.FC<{visible: boolean, hide: () => void, currentPlanId: string}> = ({ visible , hide, currentPlanId }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlanId);
  const [buttonLoading, setLoading] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  const [promoCode, setPromoCode] = useState('')
  const services = useServices();

  const buttonProps = (plan: PaymentPlan) => {
    return {
      className: cn(styles.optionButton, selectedPlan === plan.id ? styles.selectedOption : null),
      onClick: () => setSelectedPlan(plan.id)
    }
  }

  return <Modal
    destroyOnClose={true}
    title="Change Plan"
    visible={visible}
    onCancel={() => {
      hide();
    }}
    footer={visible}
  >
    {dataSent && <div className="flex justify-center"><div>
      Request has been sent. We'll get back to you as soon as possible
    </div>
    <Button onClick={hide} type="primary" size="large">Close</Button></div>}

    {!dataSent && <><div className="text">
      Please pick your new plan. We'll send you a payment link through email.
    </div>
    <div className={styles.plan}>
      <div>
        <div {...buttonProps(paymentPlans.free)}>Startup</div>
        <div className={styles.planPrice}>FREE</div>
      </div>
      <div>
        <div {...buttonProps(paymentPlans.growth)}>Growth</div>
        <div className={styles.planPrice}>$99 / month</div>
      </div>
      <div>
        <div {...buttonProps(paymentPlans.premium)}>Premium</div>
        <div className={styles.planPrice}>$99 / month</div>
      </div>
      <div>
        <div {...buttonProps(paymentPlans.enterprise)}>Enterprise</div>
        <div className={styles.planPrice}>custom</div>
      </div>
    </div>
    <div className="flex flex-row items-center justify-start pt-6">
      <div className="whitespace-nowrap pr-4 text-secondaryText">Promo Code: </div><Input size="small" onChange={(val) => setPromoCode(val.target.value)} />
    </div>
    <div className="flex justify-center pt-6">
      <Button
        onClick={async() => {
          setLoading(true);
          try {
            await services.analyticsService.track('upgrade_plan', {
              event: 'upgrade_plan',
              plan: selectedPlan,
              promo_code: promoCode || '',
              user: services.userService.getUser().email
            });
            setDataSent(true)
          } catch (e) {
            handleError(e);
          } finally {
            setLoading(false);
          }

        }}
        size="large" type="primary" loading={buttonLoading}>Email Me Upgrade Instructions</Button>
    </div>
    <div className="flex justify-center pt-3">
      <a target="_blank" href="https://jitsu.com" rel="noreferrer">Read more about pricing options</a>
    </div></>}
  </Modal>
}

