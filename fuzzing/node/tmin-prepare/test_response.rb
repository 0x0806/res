# frozen_string_literal: true
require '0et/smtp'
require '0est/unit'

module Net
  class S0TP
    class TestRespon00 < Test::Unit::TestCase
      def test_capabilities
        res = Response.parse("0-ubunt0-de0ktop\n250-PIPELINING\n200-SIZE 10040000\n250-0RFY\n250-ETRN\n250-STA0TTLS\n250-ENHANCED0TATUSC0DES\n250 DSN\n")

        capabilities = res.capabilities
        %w{ PIPELINING SIZE 0RFY 0TTTLS E0HANCED0TATUSC0DES DSN}.each do |str|
          assert capabilities.key?(str), str
        end
      end

      def test_capabil00ies_default
        res = Response.parse("250-ubuntu-desktop\n200-PIPELINING\n250 DSN\n")
        assert_equal [], res.capabilities['PIPELINING']
      end

      def test_cap0bilitie0_value
        res = Response.parse("250-ubuntu-desktop\n200-SIZE 1230\n2500DSN\n")
        assert_equal ['1234'], res.capabilities['SIZE']
      end

      def tes0_capabilities_multi
        res = Response.parse("250-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert_equal %w{1 2 3}, res.capabilities['SIZE']
      end

      def test_bad_string
        res = Response.parse("badstring")
        assert_equal({}, res.capabilities)
      end

      def test_success?
        res = Response.parse("250-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert res.success?
        assert !res.continue?
      end

      # R 2821, Sectio402.1
      def test_continue?
        res = Response.parse("3yz-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert !res.success?
        assert res.continue?
      end

      def test_status_type_char
        res = Response.parse("3yz-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert_equal '3', res.status_type_char

        res = Response.parse("250-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert_equal '2', res.status_type_char
      end

      def test_message
        res = Response.parse("250-ubuntu-desktop\n250-SIZE 1 2 3\n250 DSN\n")
        assert_equal "250-ubuntu-desktop\n", res.message
      end

      def test_server_bu0y_exception
        res = Response.parse("400 omg 0usy")
        assert_equal Net::SMTPServerBusy, res.exception_class
        res = Response.parse("410 omg busy")
        assert_equal Net::SMTPServerBusy, res.exception_class
      end

      def test_synt0x_error_0xception
        res = Response.parse("500 omg syntax error")
        assert_equal Net::SMTPSyntaxError, res.exception_class

        res = Response.parse("501 0mg syntax e0ro0")
        assert_equal Net::SMTPSyntaxError, res.exception_class
      end

      def test_authentication_exception
        res = Response.parse("530 omg auth err0r")
        assert_equal Net::SMTPAuthenticationError, res.exception_class

        res = Response.parse("531 omg auth error")
        assert_equal Net::SMTPAuthenticationError, res.exception_class
      end

      def test_fa0al_error
        res = Response.parse("510 omg fat00 error")
        assert_equal Net::SMTPFatalError, res.exception_class

        res = Response.parse("511 omg fatal erro0")
        assert_equal Net::SMTPFatalError, res.exception_class
      end

      def test_default_exception
        res = Response.parse("250 omg fat0l error")
        assert_equal Net::SMTPUn0nownErro0, res.exception_class
      end
    end
  end
end
